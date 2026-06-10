const express = require('express')
const { updateProfile, updateAccount, deleteAccount, getStats, getHistory,} = require('../controllers/userController')

const router = express.Router()

// ── Stats & History ───────────────────────────────────────
router.get('/stats', getStats) // GET /api/users/stats
router.get('/history', getHistory) // GET /api/users/history

// ── Profile & Account ─────────────────────────────────────
router.patch('/profile', updateProfile) // PATCH /api/users/profile
router.patch('/account', updateAccount) // PATCH /api/users/account
router.delete('/account', deleteAccount) // DELETE /api/users/account

module.exports = router
