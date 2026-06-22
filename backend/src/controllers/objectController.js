const Object = require('../models/Object')
const Alarm = require('../models/Alarm')

// GET /api/objects — Retrieve all objects for the authenticated user
const getObjects = async (req, res) => {
    try {
        const objects = await Object.find({ userId: req.user.userId })
        return res.status(200).json({ success: true, data: objects })
    } catch (err) {
        console.error('[objectController.getObjects]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// POST /api/onboarding/photo-challenge — Register object with reference images (min 10, max 20)
const photoChallenge = async (req, res) => {
    try {
        const { name, localRef } = req.body

        if (!name || !localRef) {
            return res.status(400).json({ success: false, error: 'MISSING_FIELDS' })
        }

        // Enforce min 10, max 20 images
        if (localRef.length < 1 || localRef.length > 20) {
            return res.status(400).json({
                success: false,
                error: 'IMAGE_COUNT_INVALID',
                message: 'Must provide between 1 and 20 reference images'
            })
        }

        const object = await Object.create({
            userId: req.user.userId,
            name,
            localRef,
        })

        return res.status(201).json({ success: true, data: object })
    } catch (err) {
        console.error('[objectController.photoChallenge]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

// PATCH /api/objects/:id — Update an object
const updateObject = async (req, res) => {
    try {
        const { name, localRef, status } = req.body

        const updateData = {}

        if (name !== undefined) {
            updateData.name = name
        }

        if (localRef !== undefined) {
            if (!Array.isArray(localRef) || localRef.length < 1 || localRef.length > 20) {
                return res.status(400).json({
                    success: false,
                    error: 'IMAGE_COUNT_INVALID',
                    message: 'Must provide between 1 and 20 reference images'
                })
            }

            updateData.localRef = localRef
        }

        if (status !== undefined) {
            updateData.status = status
        }

        const object = await Object.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.userId,
            },
            updateData,
            {
                new: true,
                runValidators: true,
            }
        )

        if (!object) {
            return res.status(404).json({ success: false, error: 'OBJECT_NOT_FOUND' })
        }

        return res.status(200).json({ success: true, data: object })
    } catch (err) {
        console.error('[objectController.updateObject]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}




// DELETE /api/objects/:id — Delete an object
const deleteObject = async (req, res) => {
    try {
        const object = await Object.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId, // Ensure user owns the object
        })

        if (!object) {
            return res.status(404).json({ success: false, error: 'OBJECT_NOT_FOUND' })
        }

        await Alarm.deleteMany({ objectId: req.params.id, userId: req.user.userId })

        return res.status(200).json({ success: true })
    } catch (err) {
        console.error('[objectController.deleteObject]', err)
        return res.status(500).json({ success: false, error: 'INTERNAL_ERROR' })
    }
}

module.exports = { getObjects, photoChallenge, updateObject, deleteObject }