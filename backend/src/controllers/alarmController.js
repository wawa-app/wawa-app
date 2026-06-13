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
        const { alarmTime, daysOfWeek, alarmType, label } = req.body

        if (!alarmTime || !Array.isArray(daysOfWeek) || daysOfWeek.length === 0) {
            return res.status(400).json({ success: false, error: 'MISSING_FIELDS' })
        }

        const userId = req.user.userId

        // Enforce max 3 alarms total
        const existingAlarms = await Alarm.find({ userId })
        if (existingAlarms.length >= 3) {
            return res.status(400).json({
                success: false,
                error: 'MAX_ALARMS_REACHED',
                message: 'Maximum 3 alarms allowed'
            })
        }

        const alarm = await Alarm.create({
            userId,
            alarmTime,
            daysOfWeek,
            label: label || '',
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
        const { alarmTime, daysOfWeek, isActive, label } = req.body
        const update = {}
        if (alarmTime !== undefined) update.alarmTime = alarmTime
        if (daysOfWeek !== undefined) update.daysOfWeek = daysOfWeek
        if (isActive !== undefined) update.isActive = isActive
        if (label !== undefined) update.label = label

        const alarm = await Alarm.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { $set: update },
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