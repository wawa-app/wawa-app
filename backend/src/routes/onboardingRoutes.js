const express = require('express')
const { photoChallenge } = require('../controllers/objectController')

const router = express.Router()

router.post('/photo-challenge', photoChallenge) // POST /api/onboarding/photo-challenge

module.exports = router
