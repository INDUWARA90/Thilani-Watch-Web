const express = require('express')
const {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
  validateCoupon,
} = require('../controllers/couponController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/validate', protect, validateCoupon)
router.route('/').get(protect, adminOnly, getCoupons).post(protect, adminOnly, createCoupon)
router.route('/:id').put(protect, adminOnly, updateCoupon).delete(protect, adminOnly, deleteCoupon)

module.exports = router
