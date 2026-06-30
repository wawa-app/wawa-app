const mongoose = require('mongoose')

const missionAttemptSchema = new mongoose.Schema({
  // ── References ────────────────────────────────────────
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Standalone challenges are not tied to a scheduled alarm.
  alarmId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Alarm', default: null },
  objectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Object', required: true },

  // ── Mission Status ────────────────────────────────────
  // pending: in progress / success: completed / failed: not completed / expired: timed out
  status:   { type: String, enum: ['pending', 'success', 'failed', 'expired'], default: 'pending' },

}, { timestamps: true })

module.exports = mongoose.model('MissionAttempt', missionAttemptSchema)
