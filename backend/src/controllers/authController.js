const jwt = require('jsonwebtoken')
const User = require('../models/User')
const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')

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
    success: true,
    data: {
      token,
      user,
    },
  })
}

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, addresses } = req.body

  if (!name || !email || !password) {
    return next(new ErrorResponse('Name, email, and password are required', 400))
  }

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return next(new ErrorResponse('Email is already registered', 409))
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

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorResponse('Email and password are required', 400))
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.matchPassword(password))) {
    return next(new ErrorResponse('Invalid email or password', 401))
  }

  if (!user.isActive) {
    return next(new ErrorResponse('Account is inactive', 403))
  }

  user.password = undefined
  sendAuthResponse(res, 200, user)
})

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', clearCookieOptions)
  res.json({ success: true, message: 'Logged out successfully' })
})

const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user })
})

const updateProfile = asyncHandler(async (req, res, next) => {
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

  res.json({ success: true, data: user })
})

const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse('Current password and new password are required', 400))
  }

  const user = await User.findById(req.user._id).select('+password')

  if (!(await user.matchPassword(currentPassword))) {
    return next(new ErrorResponse('Current password is incorrect', 401))
  }

  user.password = newPassword
  await user.save()

  res.json({ success: true, message: 'Password changed successfully' })
})

module.exports = {
  changePassword,
  getMe,
  login,
  logout,
  register,
  updateProfile,
}
