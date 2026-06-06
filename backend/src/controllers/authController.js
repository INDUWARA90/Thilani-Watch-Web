const jwt = require('jsonwebtoken')
const User = require('../models/User')
const asyncHandler = require('../utils/asyncHandler')

const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  )

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

const clearCookieOptions = {
  httpOnly: cookieOptions.httpOnly,
  secure: cookieOptions.secure,
  sameSite: cookieOptions.sameSite,
}

const sendAuthResponse = (res, statusCode, user) => {
  const token = generateToken(user)

  res.cookie('token', token, cookieOptions)
  res.status(statusCode).json({
    token,
    user,
  })
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, addresses } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' })
  }

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return res.status(409).json({ message: 'Email is already registered' })
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    addresses,
  })

  sendAuthResponse(res, 201, user)
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  if (!user.isActive) {
    return res.status(403).json({ message: 'Account is inactive' })
  }

  user.password = undefined
  sendAuthResponse(res, 200, user)
})

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', clearCookieOptions)
  res.json({ message: 'Logged out successfully' })
})

const getMe = asyncHandler(async (req, res) => {
  res.json(req.user)
})

const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'phone', 'addresses']
  const updates = {}

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field]
    }
  })

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    returnDocument: 'after',
    runValidators: true,
  })

  res.json(user)
})

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required' })
  }

  const user = await User.findById(req.user._id).select('+password')

  if (!(await user.matchPassword(currentPassword))) {
    return res.status(401).json({ message: 'Current password is incorrect' })
  }

  user.password = newPassword
  await user.save()

  res.json({ message: 'Password changed successfully' })
})

module.exports = {
  changePassword,
  getMe,
  login,
  logout,
  register,
  updateProfile,
}
