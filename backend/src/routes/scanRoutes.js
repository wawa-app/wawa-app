const express = require('express')
const {
    getMission,
    verifyMission,
    changeObject,
    emergencyOverride,
    resetCurrentStreak,
    recordChallengeSuccess,
    recordChallengeFailure,
} = require('../controllers/scanController')

const router = express.Router()

router.post('/challenge-success', recordChallengeSuccess) // POST /api/mission/challenge-success
router.post('/challenge-failure', recordChallengeFailure) // POST /api/mission/challenge-failure
router.post('/verify', verifyMission) // POST /api/mission/verify
router.patch('/change-object', changeObject) // PATCH /api/mission/change-object
router.patch('/emergency', emergencyOverride) // PATCH /api/mission/emergency
router.patch('/streak-reset', resetCurrentStreak) // PATCH /api/mission/streak-reset
router.get('/:alarmId', getMission) // GET /api/mission/:alarmId

module.exports = router
