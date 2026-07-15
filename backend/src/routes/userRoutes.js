const express = require('express')
const {
  getCustomerById,
  getCustomerOrders,
  getCustomers,
  updateCustomerStatus,
} = require('../controllers/userController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect, adminOnly)

router.get('/customers', getCustomers)
router.get('/customers/:id', getCustomerById)
router.get('/customers/:id/orders', getCustomerOrders)
router.patch('/customers/:id/status', updateCustomerStatus)

module.exports = router
