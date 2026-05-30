const express = require('express');
const { signup, login, logout } = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/signup', signup);
router.post('/login',  login);
router.post('/logout', authenticateToken, logout); // 로그아웃은 토큰 검증 후

module.exports = router;