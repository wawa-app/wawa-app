const mongoose = require('mongoose')

const objectSchema = new mongoose.Schema({
  // ── Ownership ─────────────────────────────────────────
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // ── Object Info ───────────────────────────────────────
  name:       { type: String, required: true, trim: true },   // e.g. "Coffee Machine"
  localRef:   { type: [String], required: true },             // local image paths array (min 10, max 20 enforced in controller)

}, { timestamps: true })

module.exports = mongoose.model('Object', objectSchema)