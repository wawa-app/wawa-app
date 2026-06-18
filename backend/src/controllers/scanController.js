const Alarm          = require('../models/Alarm')
const Object         = require('../models/Object')
const MissionAttempt = require('../models/MissionAttempt')
const MissionLog     = require('../models/MissionLog')
const Streak         = require('../models/Streak')
const Uni            = require('../models/Uni')
const User           = require('../models/User')

const EXP_PER_SUCCESS = 10 // MVP: flat EXP per mission success

const startOfUtcDay = (date) => {
    const day = new Date(date)
    day.setUTCHours(0, 0, 0, 0)
    return day
}

const daysBetweenUtc = (from, to) => {
    const msPerDay = 24 * 60 * 60 * 1000
    return Math.round((startOfUtcDay(to) - startOfUtcDay(from)) / msPerDay)
}

// Determine Uni stage based on level (every 5 levels = new stage)
const getStage = (level) => {
    if (level <= 5)  return 'Baby Uni'
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

    const daysSinceLastSuccess = streak.lastSuccessDate
        ? daysBetweenUtc(streak.lastSuccessDate, completedAt)
        : null

    let newCount = streak.currentCount
    if (daysSinceLastSuccess === 0) {
        newCount = Math.max(streak.currentCount, 1)
    } else if (daysSinceLastSuccess === 1) {
        newCount = streak.currentCount + 1
    } else {
        newCount = 1
    }

    streak.currentCount = newCount
    streak.longestCount = Math.max(streak.longestCount, newCount)
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
        const { alarmId, objectId, imageBase64, timeToComplete } = req.body

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
        const isSuccess = true // placeholder — replace with Vision API result

        // Create MissionAttempt record
        const attempt = await MissionAttempt.create({
            userId:   req.user.userId,
            alarmId,
            objectId,
            status:   isSuccess ? 'success' : 'failed',
        })

        // Create MissionLog record
        await MissionLog.create({
            userId:         req.user.userId,
            objectId,
            missionId:      attempt._id,
            timeToComplete: timeToComplete ?? null,
            isSuccess,
            attemptAt:      new Date(),
            completedAt:    isSuccess ? new Date() : null,
        })

        if (isSuccess) {
            await applyMissionSuccessRewards(req.user.userId)
        }

        return res.json({ success: true, result: isSuccess ? 'success' : 'failed' })
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
// Forces alarm off, logs as emergency, resets current streak to 0
const emergencyOverride = async (req, res) => {
    try {
        const { alarmId, objectId } = req.body

        const alarm = await Alarm.findOne({ _id: alarmId, userId: req.user.userId })
        if (!alarm) {
            return res.status(404).json({ success: false, error: 'ALARM_NOT_FOUND' })
        }

        const object = await Object.findOne({ _id: objectId, userId: req.user.userId })
        if (!object) {
            return res.status(404).json({ success: false, error: 'OBJECT_NOT_FOUND' })
        }

        // Create MissionAttempt as failed
        const attempt = await MissionAttempt.create({
            userId:   req.user.userId,
            alarmId,
            objectId,
            status:   'failed',
        })

        // Create MissionLog as not successful
        await MissionLog.create({
            userId:      req.user.userId,
            objectId,
            missionId:   attempt._id,
            isSuccess:   false,
            attemptAt:   new Date(),
            completedAt: null,
        })

        // Reset current streak to 0
        await Streak.findOneAndUpdate(
            { userId: req.user.userId },
            { $set: { currentCount: 0 } }
        )

        return res.json({ success: true, message: 'Emergency override logged, streak reset' })
    } catch (err) {
        console.error('[scanController.emergencyOverride]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// POST /api/mission/challenge-success
// Records a successful standalone challenge compare and updates streak/Uni stats
const recordChallengeSuccess = async (req, res) => {
    try {
        const stats = await applyMissionSuccessRewards(req.user.userId)

        return res.json({
            success: true,
            result: 'success',
            stats,
        })
    } catch (err) {
        console.error('[scanController.recordChallengeSuccess]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

module.exports = { getMission, verifyMission, changeObject, emergencyOverride, recordChallengeSuccess }
