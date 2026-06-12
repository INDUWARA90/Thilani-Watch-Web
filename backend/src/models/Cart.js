const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
  watch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Watch',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1'],
  },
  priceAtTime: {
    type: Number,
    required: true,
  },
})

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Automatically recalculate subtotal before saving
cartSchema.pre('save', async function () {
  if (this.isModified('items')) {
    this.subtotal = this.items.reduce((acc, item) => {
      return acc + (item.quantity * item.priceAtTime)
    }, 0)
  }
})

module.exports = mongoose.model('Cart', cartSchema)