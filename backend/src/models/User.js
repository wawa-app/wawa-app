const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  // ── Credentials ───────────────────────────────────────
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  username:     { type: String, required: true, trim: true },
  avatar:       { type: String, default: null },

  // ── Gamification ──────────────────────────────────────
  // exp, level, stage are managed in the Uni collection
  // streak data is managed in the Streak collection
  totalUnlocks:  { type: Number, default: 0 },         // lifetime mission success count

  // ── Onboarding ────────────────────────────────────────
  isFirstLogin: { type: Boolean, default: true },      // true until user completes first login

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