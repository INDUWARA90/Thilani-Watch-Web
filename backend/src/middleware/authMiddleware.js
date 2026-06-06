const jwt = require('jsonwebtoken')
const User = require('../models/User')
const asyncHandler = require('../utils/asyncHandler')

const protect = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization || ''
  const bearerToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
  const token = req.cookies?.token || bearerToken

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.id)

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
})

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }

  next()
}

module.exports = {
  adminOnly,
  protect,
}
