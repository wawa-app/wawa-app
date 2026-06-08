const Alarm       = require('../models/Alarm')
const Object      = require('../models/Object')
const TrackingLog = require('../models/TrackingLog')
const User        = require('../models/User')

const EXP_PER_SUCCESS = 10 // MVP: flat EXP per mission success

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
// Receives scanned image, calls OpenAI Vision API, updates streak & EXP
const verifyMission = async (req, res) => {
    try {
        const { alarmId, objectId, imageBase64, timeToComplete } = req.body

        // ── TODO: call OpenAI Vision API ──────────────────────────
        // const isSuccess = await callVisionAPI(imageBase64, objectId)
        const isSuccess = true // placeholder — replace with Vision API result

        const status = isSuccess ? 'success' : 'failed'

        // Log the attempt
        await TrackingLog.create({
            userId:         req.user.userId,
            alarmId,
            objectId,
            status,
            expGained:      isSuccess ? EXP_PER_SUCCESS : 0,
            timeToComplete: timeToComplete ?? null,
        })

        if (isSuccess) {
            // Update streak, longestStreak, EXP, totalUnlocks
            const user = await User.findById(req.user.userId)
            const newStreak = user.streak + 1
            const newExp    = user.exp + EXP_PER_SUCCESS
            // MVP: level up every 100 EXP
            const newLevel  = Math.floor(newExp / 100) + 1

            await User.findByIdAndUpdate(req.user.userId, {
                $set: {
                    streak:       newStreak,
                    longestStreak: Math.max(user.longestStreak, newStreak),
                    exp:          newExp,
                    level:        newLevel,
                },
                $inc: { totalUnlocks: 1 },
            })
        }

        return res.json({ success: true, result: status })
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
// Forces alarm off, logs as emergency, resets streak to 0
const emergencyOverride = async (req, res) => {
    try {
        const { alarmId, objectId } = req.body

        await TrackingLog.create({
            userId:   req.user.userId,
            alarmId,
            objectId,
            status:   'emergency',
            expGained: 0,
        })

        // Reset current streak
        await User.findByIdAndUpdate(req.user.userId, { $set: { streak: 0 } })

        return res.json({ success: true, message: 'Emergency override logged, streak reset' })
    } catch (err) {
        console.error('[scanController.emergencyOverride]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

module.exports = { getMission, verifyMission, changeObject, emergencyOverride }
