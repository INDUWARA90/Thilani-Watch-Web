const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    watch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Watch',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Prevent duplicate items in wishlist
wishlistSchema.index({ user: 1, watch: 1 }, { unique: true })

module.exports = mongoose.model('Wishlist', wishlistSchema)