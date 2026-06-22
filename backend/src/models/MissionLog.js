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

  // UTC day on which a successful challenge was completed (YYYY-MM-DD).
  completionDay:   { type: String, default: null },

}, { timestamps: true })

missionLogSchema.index(
  { userId: 1, completionDay: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isSuccess: true,
      completionDay: { $type: 'string' },
    },
  }
)

module.exports = mongoose.model('MissionLog', missionLogSchema)
