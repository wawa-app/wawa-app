const Alarm = require('../models/Alarm')

// GET /api/alarms — Retrieve all alarms for the authenticated user
const getAlarms = async (req, res) => {
    try {
        const alarms = await Alarm.find({ userId: req.user.userId })
        return res.status(200).json({ success: true, data: alarms })
    } catch (err) {
        console.error('[alarmController.getAlarms]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// POST /api/alarms — Create a new alarm
const createAlarm = async (req, res) => {
    try {
        const { alarmTime, dayOfWeek, alarmType } = req.body

        if (!alarmTime || dayOfWeek === undefined) {
            return res.status(400).json({ success: false, error: 'MISSING_FIELDS' })
        }

        const userId = req.user.userId

        // Enforce max 3 alarms total (2 regular + 1 special)
        const existingAlarms = await Alarm.find({ userId })
        if (existingAlarms.length >= 3) {
            return res.status(400).json({
                success: false,
                error: 'MAX_ALARMS_REACHED',
                message: 'Maximum 3 alarms allowed (2 regular + 1 special)'
            })
        }

        // Enforce max 2 regular alarms
        if (alarmType === 'regular' || !alarmType) {
            const regularAlarms = existingAlarms.filter(a => a.alarmType === 'regular')
            if (regularAlarms.length >= 2) {
                return res.status(400).json({
                    success: false,
                    error: 'MAX_REGULAR_ALARMS_REACHED',
                    message: 'Maximum 2 regular alarms allowed'
                })
            }
        }

        // Enforce max 1 special alarm
        if (alarmType === 'special') {
            const specialAlarms = existingAlarms.filter(a => a.alarmType === 'special')
            if (specialAlarms.length >= 1) {
                return res.status(400).json({
                    success: false,
                    error: 'MAX_SPECIAL_ALARMS_REACHED',
                    message: 'Maximum 1 special alarm allowed'
                })
            }
        }

        const alarm = await Alarm.create({
            userId,
            alarmTime,
            dayOfWeek,
            alarmType: alarmType || 'regular',
        })

        return res.status(201).json({ success: true, data: alarm })
    } catch (err) {
        console.error('[alarmController.createAlarm]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// GET /api/alarms/:id — Retrieve a specific alarm
const getAlarmById = async (req, res) => {
    try {
        const alarm = await Alarm.findOne({
            _id: req.params.id,
            userId: req.user.userId,
        })

        if (!alarm) {
            return res.status(404).json({ success: false, error: 'ALARM_NOT_FOUND' })
        }

        return res.status(200).json({ success: true, data: alarm })
    } catch (err) {
        console.error('[alarmController.getAlarmById]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// PUT /api/alarms/:id — Update an existing alarm
const updateAlarm = async (req, res) => {
    try {
        const { alarmTime, dayOfWeek, isActive } = req.body

        const alarm = await Alarm.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { alarmTime, dayOfWeek, isActive },
            { new: true, runValidators: true }
        )

        if (!alarm) {
            return res.status(404).json({ success: false, error: 'ALARM_NOT_FOUND' })
        }

        return res.status(200).json({ success: true, data: alarm })
    } catch (err) {
        console.error('[alarmController.updateAlarm]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// DELETE /api/alarms/:id — Delete an alarm
const deleteAlarm = async (req, res) => {
    try {
        const alarm = await Alarm.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId,
        })

        if (!alarm) {
            return res.status(404).json({ success: false, error: 'ALARM_NOT_FOUND' })
        }

        return res.status(200).json({ success: true })
    } catch (err) {
        console.error('[alarmController.deleteAlarm]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

module.exports = { getAlarms, createAlarm, getAlarmById, updateAlarm, deleteAlarm }