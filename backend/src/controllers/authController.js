const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (userId, email) =>
    jwt.sign({ userId, email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

// POST /api/auth/signup
const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'MISSING_FIELDS' });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ success: false, error: 'EMAIL_ALREADY_EXISTS' });
        }

        // Auto-generate username from email (e.g. "bella@langara.ca" → "bella")
        const username = email.split('@')[0];

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await User.create({ email: email.toLowerCase(), passwordHash, username });
        const token = signToken(user._id, user.email);

        return res.status(201).json({
            success: true,
            token,
            user: { id: user._id, email: user.email, username: user.username },
        });
    } catch (err) {
        console.error('[authController.signup]', err);
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
        return res.status(400).json({ success: false, error: 'MISSING_FIELDS' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ success: false, error: 'INVALID_CREDENTIALS' });
        }

        const token = signToken(user._id, user.email);

        return res.status(200).json({
        success: true,
        token,
        user: { id: user._id, email: user.email, username: user.username },
        });
    } catch (err) {
        console.error('[authController.login]', err);
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
    }
};

// POST /api/auth/logout
const logout = (req, res) => {
// Access Token only — actual invalidation is handled by deleting the token from client SecureStore
// When Refresh Token is introduced, null out the DB refreshToken field here
    return res.status(200).json({ success: true });
};

module.exports = { signup, login, logout };