const mongoose = require('mongoose')

const streakSchema = new mongoose.Schema({
  // ── Ownership ─────────────────────────────────────────
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // ── Streak Counts ─────────────────────────────────────
  currentCount:    { type: Number, default: 0 },   // current consecutive streak
  longestCount:    { type: Number, default: 0 },   // all-time best streak

  // ── Last Success ──────────────────────────────────────
  lastSuccessDate: { type: Date, default: null },  // date of last successful mission

}, { timestamps: true })

module.exports = mongoose.model('Streak', streakSchema)
