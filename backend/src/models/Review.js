const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    watch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Watch',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Prevent duplicate reviews: One review per user per watch
reviewSchema.index({ watch: 1, user: 1 }, { unique: true })

// Static method to calculate average rating and update Watch model
reviewSchema.statics.calculateAverageRating = async function (watchId) {
  const stats = await this.aggregate([
    { $match: { watch: watchId, isApproved: true } },
    {
      $group: {
        _id: '$watch',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ])

  const updateData = stats.length > 0 
    ? { ratingAverage: Math.round(stats[0].avgRating * 10) / 10, ratingCount: stats[0].nRating }
    : { ratingAverage: 0, ratingCount: 0 }

  await mongoose.model('Watch').findByIdAndUpdate(watchId, updateData)
}

// Hooks to trigger rating calculation
reviewSchema.post('save', function () {
  this.constructor.calculateAverageRating(this.watch)
})

// Document middleware for deleteOne
reviewSchema.post('deleteOne', { document: true, query: false }, function () {
  this.constructor.calculateAverageRating(this.watch)
})

module.exports = mongoose.model('Review', reviewSchema)