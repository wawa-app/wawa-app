const mongoose = require('mongoose')

const uniSchema = new mongoose.Schema({
  // ── Ownership ─────────────────────────────────────────
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // ── Uni Info ──────────────────────────────────────────
  avatarKey: { type: String, required: true },     // avatar identifier key
  level:     { type: Number, default: 1 },         // current level
  stage:     { type: String, default: 'Baby Uni' },// growth stage label
  exp:       { type: Number, default: 0 },         // accumulated EXP

}, { timestamps: true })

module.exports = mongoose.model('Uni', uniSchema)
