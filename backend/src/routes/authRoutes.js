const express = require('express')
const rateLimit = require('express-rate-limit')
const {
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
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many password reset requests. Please try again later.',
  },
})

const verifyOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP verification attempts. Please try again later.',
  },
})

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword)
router.post('/verify-otp', verifyOtpLimiter, verifyOtp)
router.post('/reset-password', resetPassword)
router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfile)
router.put('/change-password', protect, changePassword)
router.route('/addresses').get(protect, getAddresses).post(protect, addAddress)
router.route('/addresses/:addressId').put(protect, updateAddress).delete(protect, deleteAddress)
router.patch('/addresses/:addressId/default', protect, setDefaultAddress)

module.exports = router
