const express = require('express')
const { getObjects, photoChallenge, deleteObject } = require('../controllers/objectController')

const router = express.Router()

router.get('/', getObjects)
router.delete('/:id', deleteObject)

module.exports = router