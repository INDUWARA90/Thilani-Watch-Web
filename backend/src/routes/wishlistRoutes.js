const express = require('express')
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').get(protect, getWishlist)
router.route('/:watchId').post(protect, addToWishlist).delete(protect, removeFromWishlist)

module.exports = router