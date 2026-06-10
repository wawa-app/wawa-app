const express = require('express')
const { getMission, verifyMission, changeObject, emergencyOverride, } = require('../controllers/scanController')

const router = express.Router()

router.get('/:alarmId', getMission) // GET /api/mission/:alarmId
router.post('/verify', verifyMission) // POST /api/mission/verify
router.patch('/change-object', changeObject) // PATCH /api/mission/change-object
router.patch('/emergency', emergencyOverride) // PATCH /api/mission/emergency

module.exports = router
