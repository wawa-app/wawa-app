const express = require('express')
const { getAlarms, createAlarm, getAlarmById, updateAlarm, deleteAlarm } = require('../controllers/alarmController')

const router = express.Router()

router.get('/', getAlarms)
router.post('/', createAlarm)
router.get('/:id', getAlarmById)
router.put('/:id', updateAlarm)
router.delete('/:id', deleteAlarm)

module.exports = router