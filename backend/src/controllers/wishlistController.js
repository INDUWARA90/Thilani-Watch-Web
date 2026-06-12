const Wishlist = require('../models/Wishlist')
const Watch = require('../models/Watch')
const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')

/**
 * Get current user's wishlist items.
 */
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.find({ user: req.user._id }).populate({
    path: 'watch',
    match: { isPublished: true, deletedAt: null },
  })

  // Clean up references to unpublished or deleted watches
  const items = wishlist.filter((item) => item.watch).map((item) => item.watch)
  res.json({ success: true, data: items })
})

/**
 * Add a watch to the wishlist.
 */
const addToWishlist = asyncHandler(async (req, res, next) => {
  const watch = await Watch.findOne({ _id: req.params.watchId, isPublished: true, deletedAt: null })
  if (!watch) return next(new ErrorResponse('Watch not found or unavailable', 404))

  const existing = await Wishlist.findOne({ user: req.user._id, watch: req.params.watchId })
  if (existing) return next(new ErrorResponse('Already in wishlist', 400))

  await Wishlist.create({ user: req.user._id, watch: req.params.watchId })
  res.status(201).json({ success: true, message: 'Added to wishlist' })
})

/**
 * Remove a watch from the wishlist.
 */
const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const result = await Wishlist.findOneAndDelete({ 
    user: req.user._id, 
    watch: req.params.watchId 
  })

  if (!result) {
    return next(new ErrorResponse('Item not in wishlist', 404))
  }

  res.json({ success: true, message: 'Removed from wishlist' })
})

module.exports = { getWishlist, addToWishlist, removeFromWishlist }