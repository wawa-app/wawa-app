const mongoose = require('mongoose');

const objectSchema = new mongoose.Schema({
  // ── Ownership ─────────────────────────────────────────
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // ── Object Info ───────────────────────────────────────
    label:      { type: String, required: true, trim: true },   // e.g. "Coffee Machine"
    imageUris:  { type: [String], default: [] },                // up to 20 reference image paths
    isActive:   { type: Boolean, default: true },               // soft delete flag

}, { timestamps: true });

module.exports = mongoose.model('Object', objectSchema);