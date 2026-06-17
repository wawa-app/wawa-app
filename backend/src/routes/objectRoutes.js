const express = require('express')
const { getObjects, photoChallenge, updateObject, deleteObject } = require('../controllers/objectController')

const router = express.Router()

router.get('/', getObjects)
router.patch('/:id', updateObject)
router.delete('/:id', deleteObject)

module.exports = router