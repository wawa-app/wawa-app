const mongoose = require('mongoose');

const alarmSchema = new mongoose.Schema({
  // ── Ownership ─────────────────────────────────────────
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  objectId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Object', required: true },

  // ── Schedule ──────────────────────────────────────────
  time:       { type: String, required: true },               // "HH:MM" format e.g. "07:30"
  days:       { type: [Number], required: true },             // [0,1,2,3,4,5,6] Sun=0 ~ Sat=6
  label:      { type: String, default: '' },                  // user-defined alarm label
  isEnabled:  { type: Boolean, default: true },               // on/off toggle

}, { timestamps: true });

module.exports = mongoose.model('Alarm', alarmSchema);