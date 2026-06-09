const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  // ── Credentials ───────────────────────────────────────
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  username:     { type: String, required: true, trim: true },
  avatar:       { type: String, default: null },

  // ── Gamification ──────────────────────────────────────
  exp:          { type: Number, default: 0 },
  level:        { type: Number, default: 1 },
  streak:        { type: Number, default: 0 },         // current consecutive streak
  longestStreak: { type: Number, default: 0 },         // all-time best streak
  totalUnlocks:  { type: Number, default: 0 },         // lifetime mission success count
  stage:         { type: String, default: 'Baby Uni' }, // Uni growth stage label

  // ── Auth ──────────────────────────────────────────────
  // refreshToken: { type: String, default: null },    // uncomment when Refresh Token is introduced
  resetPasswordOtp:     { type: String,  default: null },
  resetPasswordExpires: { type: Date,    default: null },

}, { timestamps: true })

// Strip sensitive fields from API responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.passwordHash
  return obj
}

module.exports = mongoose.model('User', userSchema)