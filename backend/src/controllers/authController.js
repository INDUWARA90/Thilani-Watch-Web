const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const { sendOtpEmail } = require('../services/emailService')

const OTP_EXPIRES_MINUTES = 10
const RESET_SESSION_EXPIRES_MINUTES = 10

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

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex')

const tokensMatch = (storedToken, submittedToken) => {
  if (!storedToken || !submittedToken || storedToken.length !== submittedToken.length) return false

  return crypto.timingSafeEqual(Buffer.from(storedToken, 'hex'), Buffer.from(submittedToken, 'hex'))
}

const normalizeEmail = (email) => String(email || '').trim().toLowerCase()

const genericForgotPasswordMessage = 'If an account with that email exists, an OTP has been sent.'

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

const forgotPassword = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email)

  if (email) {
    const user = await User.findOne({ email }).select(
      '+resetOtp +resetOtpExpires +resetSessionToken +resetSessionExpires',
    )

    if (user) {
      const otp = crypto.randomInt(100000, 1000000).toString()

      user.resetOtp = hashToken(otp)
      user.resetOtpExpires = new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000)
      user.resetSessionToken = undefined
      user.resetSessionExpires = undefined
      await user.save({ validateBeforeSave: false })

      try {
        await sendOtpEmail(user.email, otp)
      } catch (error) {
        console.error(`Failed to send password reset OTP for user ${user._id}: ${error.message}`)
      }
    }
  }

  res.json({ success: true, message: genericForgotPasswordMessage })
})

const verifyOtp = asyncHandler(async (req, res, next) => {
  const email = normalizeEmail(req.body.email)
  const otp = String(req.body.otp || '').trim()

  if (!email || !/^\d{6}$/.test(otp)) {
    return next(new ErrorResponse('Invalid or expired OTP', 400))
  }

  const user = await User.findOne({
    email,
    resetOtpExpires: { $gt: Date.now() },
  }).select('+resetOtp +resetOtpExpires +resetSessionToken +resetSessionExpires')

  if (!user || !tokensMatch(user.resetOtp, hashToken(otp))) {
    return next(new ErrorResponse('Invalid or expired OTP', 400))
  }

  const resetSessionToken = crypto.randomBytes(32).toString('hex')

  user.resetOtp = undefined
  user.resetOtpExpires = undefined
  user.resetSessionToken = hashToken(resetSessionToken)
  user.resetSessionExpires = new Date(Date.now() + RESET_SESSION_EXPIRES_MINUTES * 60 * 1000)
  await user.save({ validateBeforeSave: false })

  res.json({
    success: true,
    data: {
      resetSessionToken,
    },
    message: 'OTP verified successfully',
  })
})

const resetPassword = asyncHandler(async (req, res, next) => {
  const email = normalizeEmail(req.body.email)
  const resetSessionToken = String(req.body.resetSessionToken || '').trim()
  const { newPassword } = req.body

  if (!email || !resetSessionToken) {
    return next(new ErrorResponse('Invalid or expired password reset session', 400))
  }

  if (!newPassword || String(newPassword).length < 8) {
    return next(new ErrorResponse('New password must be at least 8 characters', 400))
  }

  const user = await User.findOne({
    email,
    resetSessionExpires: { $gt: Date.now() },
  }).select('+password +resetSessionToken +resetSessionExpires')

  if (!user || !tokensMatch(user.resetSessionToken, hashToken(resetSessionToken))) {
    return next(new ErrorResponse('Invalid or expired password reset session', 400))
  }

  user.password = newPassword
  user.resetSessionToken = undefined
  user.resetSessionExpires = undefined
  await user.save()

  res.json({ success: true, message: 'Password reset successfully' })
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

const normalizeAddress = (body) => {
  const address = {
    label: body.label,
    fullName: body.fullName,
    phone: body.phone,
    addressLine1: body.addressLine1,
    addressLine2: body.addressLine2,
    city: body.city,
    district: body.district,
    postalCode: body.postalCode,
    country: body.country,
  }

  if (body.isDefault !== undefined) {
    address.isDefault = body.isDefault === true || body.isDefault === 'true'
  }

  return address
}

const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  res.json({ success: true, data: user.addresses })
})

const addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
  const address = normalizeAddress(req.body)

  if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.postalCode) {
    return next(new ErrorResponse('Full name, phone, address line 1, city, and postal code are required', 400))
  }

  if (address.isDefault || user.addresses.length === 0) {
    user.addresses.forEach((savedAddress) => {
      savedAddress.isDefault = false
    })
    address.isDefault = true
  }
  if (address.isDefault === undefined) address.isDefault = user.addresses.length === 0

  user.addresses.push(address)
  await user.save()

  res.status(201).json({ success: true, data: user.addresses[user.addresses.length - 1] })
})

const updateAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
  const address = user.addresses.id(req.params.addressId)

  if (!address) {
    return next(new ErrorResponse('Address not found', 404))
  }

  const updates = normalizeAddress(req.body)
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) address[key] = value
  })

  if (address.isDefault) {
    user.addresses.forEach((savedAddress) => {
      if (savedAddress._id.toString() !== address._id.toString()) savedAddress.isDefault = false
    })
  }

  await user.save()
  res.json({ success: true, data: address })
})

const deleteAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
  const address = user.addresses.id(req.params.addressId)

  if (!address) {
    return next(new ErrorResponse('Address not found', 404))
  }

  const wasDefault = address.isDefault
  address.deleteOne()

  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true
  }

  await user.save()
  res.json({ success: true, data: user.addresses, message: 'Address deleted' })
})

const setDefaultAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
  const address = user.addresses.id(req.params.addressId)

  if (!address) {
    return next(new ErrorResponse('Address not found', 404))
  }

  user.addresses.forEach((savedAddress) => {
    savedAddress.isDefault = savedAddress._id.toString() === address._id.toString()
  })

  await user.save()
  res.json({ success: true, data: address })
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
  addAddress,
  changePassword,
  deleteAddress,
  forgotPassword,
  getMe,
  getAddresses,
  login,
  logout,
  register,
  resetPassword,
  setDefaultAddress,
  updateAddress,
  updateProfile,
  verifyOtp,
}
