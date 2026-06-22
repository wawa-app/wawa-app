const express = require('express')
const { getMission, verifyMission, changeObject, emergencyOverride, recordChallengeSuccess } = require('../controllers/scanController')

const router = express.Router()

router.post('/challenge-success', recordChallengeSuccess) // POST /api/mission/challenge-success
router.post('/verify', verifyMission) // POST /api/mission/verify
router.patch('/change-object', changeObject) // PATCH /api/mission/change-object
router.patch('/emergency', emergencyOverride) // PATCH /api/mission/emergency
router.get('/:alarmId', getMission) // GET /api/mission/:alarmId

module.exports = router
