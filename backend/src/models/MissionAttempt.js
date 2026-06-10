const mongoose = require('mongoose')

const missionAttemptSchema = new mongoose.Schema({
  // ── References ────────────────────────────────────────
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  alarmId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Alarm', required: true },
  objectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Object', required: true },

  // ── Mission Status ────────────────────────────────────
  // pending: in progress / success: completed / failed: not completed / expired: timed out
  status:   { type: String, enum: ['pending', 'success', 'failed', 'expired'], default: 'pending' },

}, { timestamps: true })

module.exports = mongoose.model('MissionAttempt', missionAttemptSchema)
