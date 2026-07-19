const express = require('express')
const {
  createWatch,
  deleteWatch,
  getAdminWatches,
  getBestSellers,
  getFeaturedWatches,
  getLowStockWatches,
  getNewArrivals,
  getWatch,
  getWatchBySlug,
  getWatches,
  updateWatch,
  updateWatchPublish,
  updateWatchStock,
} = require('../controllers/watchController')
const { adminOnly, protect } = require('../middleware/authMiddleware')
const { publicCache } = require('../middleware/cacheMiddleware')

const router = express.Router()


router.route('/').get(publicCache(), getWatches).post(protect, adminOnly, createWatch)

router.get('/admin/all', protect, adminOnly, getAdminWatches)
router.get('/admin/low-stock', protect, adminOnly, getLowStockWatches)
router.get('/featured', publicCache(), getFeaturedWatches)
router.get('/new-arrivals', publicCache(), getNewArrivals)
router.get('/best-sellers', publicCache(), getBestSellers)
router.get('/slug/:slug', publicCache(), getWatchBySlug)

router.patch('/:id/stock', protect, adminOnly, updateWatchStock)
router.patch('/:id/publish', protect, adminOnly, updateWatchPublish)
router.route('/:id').get(publicCache(), getWatch).put(protect, adminOnly, updateWatch).delete(protect, adminOnly, deleteWatch)

module.exports = router
