const express = require('express')
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} = require('../controllers/orderController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').get(protect, adminOnly, getAllOrders).post(protect, createOrder)
router.get('/my-orders', protect, getMyOrders)
router.get('/:id', protect, getOrderById)
router.patch('/:id/cancel', protect, cancelOrder)
router.patch('/:id/status', protect, adminOnly, updateOrderStatus)
router.patch('/:id/payment-status', protect, adminOnly, updatePaymentStatus)

module.exports = router