const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer <token>

    if (!token) {
        return res.status(401).json({ 
        success: false, 
        error: 'ACCESS_TOKEN_MISSING' 
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
        const error = err.name === 'TokenExpiredError' 
            ? 'ACCESS_TOKEN_EXPIRED' 
            : 'ACCESS_TOKEN_INVALID'
        return res.status(401).json({ success: false, error })
        }
        req.user = payload // { userId, email }
        next()
    })
}

module.exports = authenticateToken