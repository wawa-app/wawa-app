const mongoose = require('mongoose')

const alarmSchema = new mongoose.Schema({
  // ── Ownership ─────────────────────────────────────────
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // ── Schedule ──────────────────────────────────────────
  alarmTime:    { type: String, required: true, default: '07:00' }, // "HH:MM", initialized as AM
  dayOfWeek:    { type: Number, required: true, min: 0, max: 6 },   // 0=Sun ~ 6=Sat

  // ── Type ──────────────────────────────────────────────
  // regular: max 2, special: max 1 (enforced in controller)
  alarmType:    { type: String, enum: ['regular', 'special'], default: 'regular' },

  // ── Status ────────────────────────────────────────────
  isActive:     { type: Boolean, default: true },

}, { timestamps: true })

module.exports = mongoose.model('Alarm', alarmSchema)