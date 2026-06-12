const Review = require('../models/Review')
const Watch = require('../models/Watch')
const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')

/**
 * Get reviews for a specific watch.
 */
const getWatchReviews = asyncHandler(async (req, res) => {
  const { watchId } = req.params
  const filter = watchId ? { watch: watchId, isApproved: true } : { isApproved: true }

  const reviews = await Review.find(filter)
    .populate('user', 'name')
    .sort('-createdAt')

  res.json({ success: true, data: reviews })
})

/**
 * Add a new review.
 */
const createReview = asyncHandler(async (req, res, next) => {
  const { rating, title, comment } = req.body
  const { watchId } = req.params

  const watch = await Watch.findOne({ _id: watchId, isPublished: true, deletedAt: null })
  if (!watch) return next(new ErrorResponse('Watch not found or unavailable', 404))

  const alreadyReviewed = await Review.findOne({ watch: watchId, user: req.user._id })
  if (alreadyReviewed) return next(new ErrorResponse('You have already reviewed this watch', 400))

  const review = await Review.create({
    watch: watchId,
    user: req.user._id,
    rating,
    title,
    comment,
  })

  res.status(201).json({ success: true, data: review })
})

/**
 * Update an existing review.
 */
const updateReview = asyncHandler(async (req, res, next) => {
  const { rating, title, comment } = req.body
  const review = await Review.findById(req.params.id)

  if (!review) return next(new ErrorResponse('Review not found', 404))

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to edit this review', 403))
  }

  review.rating = rating || review.rating
  review.title = title || review.title
  review.comment = comment || review.comment

  await review.save()
  res.json({ success: true, data: review })
})

/**
 * Delete a review.
 */
const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
  if (!review) return next(new ErrorResponse('Review not found', 404))

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized', 403))
  }

  await review.deleteOne()
  res.json({ success: true, message: 'Review removed' })
})

/**
 * Admin: Toggle review visibility.
 */
const toggleReviewApproval = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
  if (!review) return next(new ErrorResponse('Review not found', 404))

  review.isApproved = !review.isApproved
  await review.save()
  res.json({ success: true, data: review })
})

module.exports = { getWatchReviews, createReview, updateReview, deleteReview, toggleReviewApproval }