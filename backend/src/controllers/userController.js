const bcrypt        = require('bcryptjs')
const User          = require('../models/User')
const Streak        = require('../models/Streak')
const Uni           = require('../models/Uni')
const MissionAttempt = require('../models/MissionAttempt')
const MissionLog    = require('../models/MissionLog')

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
// Permanently deletes user and all related data across all collections
const deleteAccount = async (req, res) => {
    try {
        const Alarm  = require('../models/Alarm')
        const Object = require('../models/Object')

        await MissionLog.deleteMany({ userId: req.user.userId })
        await MissionAttempt.deleteMany({ userId: req.user.userId })
        await Streak.deleteMany({ userId: req.user.userId })
        await Uni.deleteMany({ userId: req.user.userId })
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
// Returns aggregate stats from User, Streak, and Uni collections
const getStats = async (req, res) => {
    try {
        const user   = await User.findById(req.user.userId).select('username avatar totalUnlocks')
        if (!user) return res.status(404).json({ success: false, error: 'USER_NOT_FOUND' })

        const streak = await Streak.findOne({ userId: req.user.userId })
        const uni    = await Uni.findOne({ userId: req.user.userId })

        return res.json({
            success: true,
            stats: {
                username:     user.username,
                avatar:       user.avatar,
                totalUnlocks: user.totalUnlocks,
                streak: {
                    currentCount:    streak?.currentCount    ?? 0,
                    longestCount:    streak?.longestCount    ?? 0,
                    lastSuccessDate: streak?.lastSuccessDate ?? null,
                },
                uni: {
                    avatarKey: uni?.avatarKey ?? 'default',
                    level:     uni?.level     ?? 1,
                    stage:     uni?.stage     ?? 'Baby Uni',
                    exp:       uni?.exp       ?? 0,
                },
            }
        })
    } catch (err) {
        console.error('[userController.getStats]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// GET /api/users/history
// Returns past mission logs, newest first
const getHistory = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query
        const logs = await MissionLog.find({ userId: req.user.userId })
            .sort({ attemptAt: -1 })
            .skip(Number(offset))
            .limit(Number(limit))
            .populate('missionId', 'alarmId objectId status')
            .populate('objectId', 'name localRef')

        return res.json({ success: true, logs })
    } catch (err) {
        console.error('[userController.getHistory]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

module.exports = { updateProfile, updateAccount, deleteAccount, getStats, getHistory }
