const express = require('express')
const {
  addAddress,
  changePassword,
  deleteAddress,
  getMe,
  getAddresses,
  login,
  logout,
  register,
  setDefaultAddress,
  updateAddress,
  updateProfile,
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfile)
router.put('/change-password', protect, changePassword)
router.route('/addresses').get(protect, getAddresses).post(protect, addAddress)
router.route('/addresses/:addressId').put(protect, updateAddress).delete(protect, deleteAddress)
router.patch('/addresses/:addressId/default', protect, setDefaultAddress)

module.exports = router
