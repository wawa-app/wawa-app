const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const User = require('../models/User')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

const signToken = (userId, email) =>
    jwt.sign({ userId, email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    })

// POST /api/auth/signup
const signup = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'MISSING_FIELDS' })
        }

        const existing = await User.findOne({ email: email.toLowerCase() })
        if (existing) {
            return res.status(409).json({ success: false, error: 'EMAIL_ALREADY_EXISTS' })
        }

        // Auto-generate username from email (e.g. "bella@langara.ca" → "bella")
        const username = email.split('@')[0]

        const passwordHash = await bcrypt.hash(password, 12)
        const user = await User.create({ email: email.toLowerCase(), passwordHash, username })
        const token = signToken(user._id, user.email)

        return res.status(201).json({
            success: true,
            token,
            user: { id: user._id, email: user.email, username: user.username },
        })
    } catch (err) {
        console.error('[authController.signup]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
        return res.status(400).json({ success: false, error: 'MISSING_FIELDS' })
        }

        const user = await User.findOne({ email: email.toLowerCase() })

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ success: false, error: 'INVALID_CREDENTIALS' })
        }

        const token = signToken(user._id, user.email)

        return res.status(200).json({
        success: true,
        token,
        user: { id: user._id, email: user.email, username: user.username },
        })
    } catch (err) {
        console.error('[authController.login]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// POST /api/auth/forgot-password
// Generates a 6-digit OTP and sends it to the user's email
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) return res.status(400).json({ success: false, error: 'MISSING_FIELDS' })

        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) return res.status(404).json({ success: false, error: 'USER_NOT_FOUND' })

        const otp = Math.floor(100000 + Math.random() * 900000).toString() // 6-digit
        user.resetPasswordOtp     = otp
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        await user.save()

        await transporter.sendMail({
            from:    `"WaWa" <${process.env.EMAIL_USER}>`,
            to:      user.email,
            subject: 'Your WaWa password reset code',
            text:    `Your verification code is: ${otp}\n\nThis code expires in 10 minutes.`,
        })

        return res.json({ success: true })
    } catch (err) {
        console.error('[authController.forgotPassword]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// POST /api/auth/verify-otp
// Verifies the 6-digit OTP before allowing password reset
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        if (!email || !otp) return res.status(400).json({ success: false, error: 'MISSING_FIELDS' })

        const user = await User.findOne({
            email:                email.toLowerCase(),
            resetPasswordOtp:     otp,
            resetPasswordExpires: { $gt: new Date() },
        })
        if (!user) return res.status(400).json({ success: false, error: 'INVALID_OR_EXPIRED_OTP' })

        return res.json({ success: true })
    } catch (err) {
        console.error('[authController.verifyOtp]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, error: 'MISSING_FIELDS' })
        }

        const user = await User.findOne({
            email:                email.toLowerCase(),
            resetPasswordOtp:     otp,
            resetPasswordExpires: { $gt: new Date() },
        })
        if (!user) return res.status(400).json({ success: false, error: 'INVALID_OR_EXPIRED_OTP' })

        user.passwordHash         = await bcrypt.hash(newPassword, 12)
        user.resetPasswordOtp     = null
        user.resetPasswordExpires = null
        await user.save()

        return res.json({ success: true })
    } catch (err) {
        console.error('[authController.resetPassword]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// GET /api/auth/me
const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
        if (!user) return res.status(404).json({ success: false, error: 'USER_NOT_FOUND' })
        return res.json({ success: true, user })
    } catch (err) {
        console.error('[authController.me]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// POST /api/auth/logout
const logout = (req, res) => {
// Access Token only — actual invalidation is handled by deleting the token from client SecureStore
// When Refresh Token is introduced, null out the DB refreshToken field here
    return res.status(200).json({ success: true })
}

module.exports = { signup, login, logout, me, forgotPassword, verifyOtp, resetPassword }