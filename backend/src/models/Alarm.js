const mongoose = require('mongoose')

const alarmSchema = new mongoose.Schema({
  // ── Ownership ─────────────────────────────────────────
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // ── Schedule ──────────────────────────────────────────
  alarmTime: { type: String, required: true }, // "HH:MM"
  daysOfWeek: {
    type: [Number], // 0=Sun ~ 6=Sat
    required: true,
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length > 0 && arr.every((d) => d >= 0 && d <= 6),
      message: 'daysOfWeek must be a non-empty array of 0-6',
    },
  },

  // ── Type ──────────────────────────────────────────────
  // regular: max 2, special: max 1 (enforced in controller)
  alarmType: { type: String, enum: ['regular', 'special'], default: 'regular' },

  // ── Status ────────────────────────────────────────────
  isActive: { type: Boolean, default: true },

}, { timestamps: true })

module.exports = mongoose.model('Alarm', alarmSchema)