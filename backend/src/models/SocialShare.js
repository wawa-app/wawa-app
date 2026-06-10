const mongoose = require('mongoose')

const socialShareSchema = new mongoose.Schema({
  // ── Ownership ─────────────────────────────────────────
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uniId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Uni', required: true },
  streakId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Streak', required: true },

  // ── Share Info ────────────────────────────────────────
  // uni: share Uni label name + level / streak: share streak date + average time
  shareType: { type: String, enum: ['uni', 'streak'], required: true },
  platform:  { type: String, enum: ['instagram', 'x', 'facebook'], required: true },

  // ── Timestamp ─────────────────────────────────────────
  sharedAt:  { type: Date, default: Date.now },

}, { timestamps: true })

module.exports = mongoose.model('SocialShare', socialShareSchema)
