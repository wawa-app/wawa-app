const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    username:     { type: String, required: true, trim: true },
    avatar:       { type: String, default: null },
    // refreshToken: { type: String, default: null },
}, { timestamps: true });

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.passwordHash;
    return obj;
};

module.exports = mongoose.model('User', userSchema);