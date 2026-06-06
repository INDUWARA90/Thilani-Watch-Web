const express = require('express')
const {
  createWatch,
  deleteWatch,
  getBestSellers,
  getFeaturedWatches,
  getNewArrivals,
  getWatch,
  getWatchBySlug,
  getWatches,
  updateWatch,
  updateWatchPublish,
  updateWatchStock,
} = require('../controllers/watchController')
const { adminOnly, protect } = require('../middleware/authMiddleware')

const router = express.Router()


router.route('/').get(getWatches).post(protect, adminOnly, createWatch)

router.get('/featured', getFeaturedWatches)
router.get('/new-arrivals', getNewArrivals)
router.get('/best-sellers', getBestSellers)
router.get('/slug/:slug', getWatchBySlug)

router.patch('/:id/stock', protect, adminOnly, updateWatchStock)
router.patch('/:id/publish', protect, adminOnly, updateWatchPublish)
router.route('/:id').get(getWatch).put(protect, adminOnly, updateWatch).delete(protect, adminOnly, deleteWatch)

module.exports = router
