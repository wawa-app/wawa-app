const bcrypt = require('bcryptjs')
const User = require('../models/User')
const TrackingLog = require('../models/TrackingLog')

// PATCH /api/users/profile
// Updates username and/or avatar
const updateProfile = async (req, res) => {
    try {
        const { username, avatar } = req.body
        const updates = {}
        if (username) updates.username = username.trim()
        if (avatar)   updates.avatar   = avatar

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: updates },
            { new: true }
        )
        return res.json({ success: true, user })
    } catch (err) {
        console.error('[userController.updateProfile]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// PATCH /api/users/account
// Updates email and/or password (requires current password to confirm)
const updateAccount = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body
        const user = await User.findById(req.user.userId).select('+passwordHash')

        if (!user) return res.status(404).json({ success: false, error: 'USER_NOT_FOUND' })

        // Always verify current password before any sensitive change
        if (!currentPassword) {
            return res.status(400).json({ success: false, error: 'CURRENT_PASSWORD_REQUIRED' })
        }
        const valid = await bcrypt.compare(currentPassword, user.passwordHash)
        if (!valid) {
            return res.status(401).json({ success: false, error: 'INVALID_CURRENT_PASSWORD' })
        }

        const updates = {}
        if (email)       updates.email        = email.toLowerCase().trim()
        if (newPassword) updates.passwordHash = await bcrypt.hash(newPassword, 12)

        await User.findByIdAndUpdate(req.user.userId, { $set: updates })
        return res.json({ success: true, message: 'Account updated' })
    } catch (err) {
        console.error('[userController.updateAccount]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// DELETE /api/users/account
// Permanently deletes user and all related data
const deleteAccount = async (req, res) => {
    try {
        await TrackingLog.deleteMany({ userId: req.user.userId })
        // Alarms and Objects cascade via userId — delete them too
        const Alarm  = require('../models/Alarm')
        const Object = require('../models/Object')
        await Alarm.deleteMany({ userId: req.user.userId })
        await Object.deleteMany({ userId: req.user.userId })
        await User.findByIdAndDelete(req.user.userId)

        return res.json({ success: true, message: 'Account deleted' })
    } catch (err) {
        console.error('[userController.deleteAccount]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// GET /api/users/stats
// Returns aggregate stats: streak, level, exp, totalUnlocks
const getStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select(
            'username avatar level exp streak longestStreak totalUnlocks stage'
        )
        if (!user) return res.status(404).json({ success: false, error: 'USER_NOT_FOUND' })
        return res.json({ success: true, stats: user })
    } catch (err) {
        console.error('[userController.getStats]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// GET /api/users/history
// Returns past mission attempt logs, newest first
const getHistory = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query
        const logs = await TrackingLog.find({ userId: req.user.userId })
            .sort({ triggeredAt: -1 })
            .skip(Number(offset))
            .limit(Number(limit))
            .populate('alarmId', 'alarmTime dayOfWeek alarmType')
            .populate('objectId', 'name localRef')

        return res.json({ success: true, logs })
    } catch (err) {
        console.error('[userController.getHistory]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

module.exports = { updateProfile, updateAccount, deleteAccount, getStats, getHistory }
