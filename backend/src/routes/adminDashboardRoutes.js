const express = require('express')
const {
  getDashboardSummary,
  getSalesSummary,
} = require('../controllers/adminDashboardController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect, adminOnly)

router.get('/summary', getDashboardSummary)
router.get('/sales', getSalesSummary)

module.exports = router
