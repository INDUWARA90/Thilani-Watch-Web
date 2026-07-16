const express = require('express')
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  confirmPayment,
  createOrderPaymentIntent,
  getAllOrders,
  updateOrderStatus,
  updateOrderShipping,
  updatePaymentStatus,
  processReturn,
  refundOrder,
  requestReturn,
} = require('../controllers/orderController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').get(protect, adminOnly, getAllOrders).post(protect, createOrder)
router.get('/my-orders', protect, getMyOrders)
router.get('/:id', protect, getOrderById)
router.patch('/:id/cancel', protect, cancelOrder)
router.post('/:id/payment-intent', protect, createOrderPaymentIntent)
router.post('/:id/return', protect, requestReturn)
router.patch('/:id/return', protect, adminOnly, processReturn)
router.post('/:id/refund', protect, adminOnly, refundOrder)
router.patch('/:id/status', protect, adminOnly, updateOrderStatus)
router.patch('/:id/shipping', protect, adminOnly, updateOrderShipping)
router.patch('/:id/payment-status', protect, adminOnly, updatePaymentStatus)
router.patch('/:id/confirm-payment', protect, adminOnly, confirmPayment)

module.exports = router
