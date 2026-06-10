const mongoose = require('mongoose')

const missionLogSchema = new mongoose.Schema({
  // ── References ────────────────────────────────────────
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  objectId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Object', required: true },
  missionId:       { type: mongoose.Schema.Types.ObjectId, ref: 'MissionAttempt', required: true },

  // ── Mission Result ────────────────────────────────────
  timeToComplete:  { type: Number, default: null },   // seconds from alarm fire to success
  isSuccess:       { type: Boolean, required: true },

  // ── Timestamps ────────────────────────────────────────
  attemptAt:       { type: Date, default: Date.now }, // when mission was started
  completedAt:     { type: Date, default: null },     // when mission was completed

}, { timestamps: true })

module.exports = mongoose.model('MissionLog', missionLogSchema)
