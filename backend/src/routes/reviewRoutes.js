const express = require('express')
const {
  getWatchReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleReviewApproval,
} = require('../controllers/reviewController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

const router = express.Router({ mergeParams: true })

router.route('/').get(getWatchReviews).post(protect, createReview)

router.route('/:id').put(protect, updateReview).delete(protect, deleteReview)

router.patch('/:id/approve', protect, adminOnly, toggleReviewApproval)

module.exports = router