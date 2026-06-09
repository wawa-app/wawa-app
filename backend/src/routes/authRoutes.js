const express = require('express')
const { signup, login, logout, me, forgotPassword, verifyOtp, resetPassword } = require('../controllers/authController')
const authenticateToken = require('../middleware/authenticateToken')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp', verifyOtp)
router.post('/reset-password', resetPassword)
router.get('/me', authenticateToken, me)
router.post('/logout', authenticateToken, logout)

module.exports = router