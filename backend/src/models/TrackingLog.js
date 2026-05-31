const mongoose = require('mongoose');

const trackingLogSchema = new mongoose.Schema({
  // ── References ────────────────────────────────────────
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    alarmId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Alarm', required: true },
    objectId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Object', required: true },

  // ── Mission Result ────────────────────────────────────
    status:     { type: String, enum: ['success', 'failed', 'emergency'], required: true },
    expGained:  { type: Number, default: 0 },                   // EXP awarded on success
    attemptCount: { type: Number, default: 1 },                 // number of scan attempts made

  // ── Timestamp ─────────────────────────────────────────
    triggeredAt: { type: Date, default: Date.now },             // when alarm fired

}, { timestamps: true });

module.exports = mongoose.model('TrackingLog', trackingLogSchema);