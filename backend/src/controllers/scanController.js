const Alarm = require('../models/Alarm')
const Object = require('../models/Object')
const MissionAttempt = require('../models/MissionAttempt')
const MissionLog = require('../models/MissionLog')
const Streak = require('../models/Streak')
const Uni = require('../models/Uni')
const User = require('../models/User')

const EXP_PER_SUCCESS = 10 // MVP: flat EXP per mission success

const startOfUtcDay = (date) => {
    const day = new Date(date)
    day.setUTCHours(0, 0, 0, 0)
    return day
}

const utcDayKey = (date) => startOfUtcDay(date).toISOString().slice(0, 10)

const getMissionRewardStats = async (userId) => {
    const [streak, uni] = await Promise.all([
        Streak.findOne({ userId }),
        Uni.findOne({ userId }),
    ])

    return {
        awarded: false,
        streak: {
            currentCount: streak?.currentCount ?? 0,
            longestCount: streak?.longestCount ?? 0,
            lastSuccessDate: streak?.lastSuccessDate ?? null,
        },
        uni: {
            avatarKey: uni?.avatarKey ?? 'default',
            level: uni?.level ?? 1,
            stage: uni?.stage ?? 'Baby Uni',
            exp: uni?.exp ?? 0,
        },
    }
}

const hasSuccessfulMissionToday = async (userId, completedAt) => {
    const [existing, streak] = await Promise.all([
        MissionLog.findOne({
            userId,
            isSuccess: true,
            completionDay: utcDayKey(completedAt),
        }),
        Streak.findOne({ userId }),
    ])

    const alreadyAwardedByStreak = streak?.lastSuccessDate
        ? utcDayKey(streak.lastSuccessDate) === utcDayKey(completedAt)
        : false

    return Boolean(existing) || alreadyAwardedByStreak
}

// Determine Uni stage based on level (every 5 levels = new stage)
const getStage = (level) => {
    if (level <= 5) return 'Baby Uni'
    if (level <= 10) return 'Child Uni'
    if (level <= 15) return 'Teen Uni'
    if (level <= 20) return 'Adult Uni'
    if (level <= 25) return 'Worker Uni'
    if (level <= 30) return 'Senior Uni'
    return 'Chubby Uni'
}

const applyMissionSuccessRewards = async (userId, completedAt = new Date()) => {
    let streak = await Streak.findOne({ userId })
    if (!streak) {
        streak = await Streak.create({ userId })
    }

    const newCount = (streak.currentCount ?? 0) + 1
    streak.currentCount = newCount
    streak.longestCount = Math.max(streak.longestCount ?? 0, newCount)
    streak.lastSuccessDate = completedAt
    await streak.save()

    let uni = await Uni.findOne({ userId })
    if (!uni) {
        uni = await Uni.create({ userId, avatarKey: 'default' })
    }

    const newExp = uni.exp + EXP_PER_SUCCESS
    const newLevel = Math.floor(newExp / 100) + 1
    const newStage = getStage(newLevel)

    uni.exp = newExp
    uni.level = newLevel
    uni.stage = newStage
    await uni.save()

    await User.findByIdAndUpdate(userId, { $inc: { totalUnlocks: 1 } })

    return {
        awarded: true,
        streak: {
            currentCount: streak.currentCount,
            longestCount: streak.longestCount,
            lastSuccessDate: streak.lastSuccessDate,
        },
        uni: {
            avatarKey: uni.avatarKey,
            level: uni.level,
            stage: uni.stage,
            exp: uni.exp,
        },
    }
}

const applyMissionFailurePenalty = async (userId, { reset = false } = {}) => {
    if (reset) {
        await Streak.findOneAndUpdate(
            { userId },
            { $set: { currentCount: 0, lastSuccessDate: null } },
            { upsert: true, setDefaultsOnInsert: true }
        )
    }


    return getMissionRewardStats(userId)
}

// GET /api/mission/:alarmId
// Fetches active mission config when alarm fires (called by Android BroadcastReceiver)
const getMission = async (req, res) => {
    try {
        const alarm = await Alarm.findOne({
            _id: req.params.alarmId,
            userId: req.user.userId,
            isActive: true,
        }).populate('objectId', 'name localRef')

        if (!alarm) {
            return res.status(404).json({ success: false, error: 'ALARM_NOT_FOUND' })
        }

        return res.json({ success: true, mission: alarm })
    } catch (err) {
        console.error('[scanController.getMission]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// POST /api/mission/verify
// Receives scanned image, calls OpenAI Vision API, updates Streak, Uni, and logs result
const verifyMission = async (req, res) => {
    try {
        const { alarmId, objectId, timeToComplete, failedAttemptCount } = req.body
        const isSuccess = req.body.isSuccess ?? true // front-end Vision result; falls back to true until backend Vision lands
        const shouldResetStreak = !isSuccess && Number(failedAttemptCount) >= 3

        if (shouldResetStreak) {
            await applyMissionFailurePenalty(req.user.userId, { reset: true })
        }

        const alarm = await Alarm.findOne({ _id: alarmId, userId: req.user.userId })
        if (!alarm) {
            return res.status(404).json({ success: false, error: 'ALARM_NOT_FOUND' })
        }

        const object = await Object.findOne({ _id: objectId, userId: req.user.userId })
        if (!object) {
            return res.status(404).json({ success: false, error: 'OBJECT_NOT_FOUND' })
        }

        // ── TODO: call OpenAI Vision API ──────────────────────────
        // const isSuccess = await callVisionAPI(imageBase64, objectId)
        // const isSuccess = true // placeholder — replace with Vision API result
        const attemptAt = new Date()
        const completionDay = isSuccess ? utcDayKey(attemptAt) : null
        const alreadyCompletedToday = isSuccess
            ? await hasSuccessfulMissionToday(req.user.userId, attemptAt)
            : false
        const logCompletionDay = alreadyCompletedToday ? null : completionDay

        // Create MissionAttempt record
        const attempt = await MissionAttempt.create({
            userId: req.user.userId,
            alarmId,
            objectId,
            status: isSuccess ? 'success' : 'failed',
        })

        // Create MissionLog record
        await MissionLog.create({
            userId: req.user.userId,
            objectId,
            missionId: attempt._id,
            timeToComplete: timeToComplete ?? null,
            isSuccess,
            attemptAt,
            completedAt: isSuccess ? attemptAt : null,
            completionDay: logCompletionDay,
        })

        const stats = isSuccess && alreadyCompletedToday
            ? await getMissionRewardStats(req.user.userId)
            : isSuccess
                ? await applyMissionSuccessRewards(req.user.userId, attemptAt)
            : await applyMissionFailurePenalty(req.user.userId, {
                reset: shouldResetStreak,
            })

        return res.json({
            success: true,
            result: isSuccess ? 'success' : 'failed',
            awarded: isSuccess ? !alreadyCompletedToday : false,
            alreadyCompletedToday,
            stats,
        })
    } catch (err) {
        console.error('[scanController.verifyMission]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// PATCH /api/mission/change-object
// Swaps the target object mid-mission (before scan is submitted)
const changeObject = async (req, res) => {
    try {
        const { alarmId, newObjectId } = req.body

        const object = await Object.findOne({ _id: newObjectId, userId: req.user.userId })
        if (!object) {
            return res.status(404).json({ success: false, error: 'OBJECT_NOT_FOUND' })
        }

        await Alarm.findOneAndUpdate(
            { _id: alarmId, userId: req.user.userId },
            { $set: { objectId: newObjectId } }
        )

        return res.json({ success: true, newObjectId })
    } catch (err) {
        console.error('[scanController.changeObject]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// PATCH /api/mission/emergency
// Logs an emergency exit and breaks the current streak.
const emergencyOverride = async (req, res) => {
    try {
        const { alarmId, objectId } = req.body
        if (!objectId) {
            return res.status(400).json({ success: false, error: 'MISSING_OBJECT_ID' })
        }

        if (alarmId) {
            const alarm = await Alarm.findOne({ _id: alarmId, userId: req.user.userId })
            if (!alarm) {
                return res.status(404).json({ success: false, error: 'ALARM_NOT_FOUND' })
            }
        }

        const object = await Object.findOne({ _id: objectId, userId: req.user.userId })
        if (!object) {
            return res.status(404).json({ success: false, error: 'OBJECT_NOT_FOUND' })
        }

        const attemptAt = new Date()

        // Create MissionAttempt as failed
        const attempt = await MissionAttempt.create({
            userId: req.user.userId,
            alarmId: alarmId || null,
            objectId,
            status: 'failed',
        })

        // Create MissionLog as not successful
        await MissionLog.create({
            userId: req.user.userId,
            objectId,
            missionId: attempt._id,
            isSuccess: false,
            attemptAt,
            completedAt: null,
        })

        // Reset current streak to 0 and clear the last success date so the next
        // successful mission can start a fresh streak at 1.
        await Streak.findOneAndUpdate(
            { userId: req.user.userId },
            { $set: { currentCount: 0, lastSuccessDate: null } },
            { upsert: true, setDefaultsOnInsert: true }
        )

        const stats = await getMissionRewardStats(req.user.userId)

        return res.json({
            success: true,
            message: 'Emergency override logged, streak reset',
            stats,
        })
    } catch (err) {
        console.error('[scanController.emergencyOverride]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// POST /api/mission/challenge-success
// Records a successful standalone challenge compare and updates streak/Uni stats
const recordChallengeSuccess = async (req, res) => {
    try {
        const { objectId } = req.body
        if (!objectId) {
            return res.status(400).json({ success: false, error: 'MISSING_OBJECT_ID' })
        }

        const object = await Object.findOne({ _id: objectId, userId: req.user.userId })
        if (!object) {
            return res.status(404).json({ success: false, error: 'OBJECT_NOT_FOUND' })
        }

        const completedAt = new Date()
        const completionDay = utcDayKey(completedAt)
        const alreadyCompletedToday = await hasSuccessfulMissionToday(req.user.userId, completedAt)
        const logCompletionDay = alreadyCompletedToday ? null : completionDay
        const attempt = await MissionAttempt.create({
            userId: req.user.userId,
            objectId,
            status: 'success',
        })

        await MissionLog.create({
            userId: req.user.userId,
            objectId,
            missionId: attempt._id,
            isSuccess: true,
            attemptAt: completedAt,
            completedAt,
            completionDay: logCompletionDay,
        })

        const stats = alreadyCompletedToday
            ? await getMissionRewardStats(req.user.userId)
            : await applyMissionSuccessRewards(req.user.userId, completedAt)

        return res.json({
            success: true,
            result: 'success',
            awarded: !alreadyCompletedToday,
            alreadyCompletedToday,
            stats,
        })
    } catch (err) {
        console.error('[scanController.recordChallengeSuccess]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// POST /api/mission/challenge-failure
// Records a failed standalone challenge compare and decreases/resets the streak.
const recordChallengeFailure = async (req, res) => {
    try {
        const { objectId, failedAttemptCount } = req.body
        const shouldResetStreak = Number(failedAttemptCount) >= 3

        if (shouldResetStreak) {
            await applyMissionFailurePenalty(req.user.userId, { reset: true })
        }

        if (!objectId) {
            return res.status(400).json({ success: false, error: 'MISSING_OBJECT_ID' })
        }

        const object = await Object.findOne({ _id: objectId, userId: req.user.userId })
        if (!object) {
            return res.status(404).json({ success: false, error: 'OBJECT_NOT_FOUND' })
        }

        const attemptAt = new Date()
        const attempt = await MissionAttempt.create({
            userId: req.user.userId,
            objectId,
            status: 'failed',
        })

        await MissionLog.create({
            userId: req.user.userId,
            objectId,
            missionId: attempt._id,
            isSuccess: false,
            attemptAt,
            completedAt: null,
        })

        const stats = await applyMissionFailurePenalty(req.user.userId, {
            reset: shouldResetStreak,
        })

        return res.json({
            success: true,
            result: 'failed',
            stats,
        })
    } catch (err) {
        console.error('[scanController.recordChallengeFailure]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

module.exports = {
    getMission,
    verifyMission,
    changeObject,
    emergencyOverride,
    recordChallengeSuccess,
    recordChallengeFailure,
}
