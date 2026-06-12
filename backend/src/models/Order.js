const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  watch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Watch',
    required: true,
  },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
})

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
})

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: addressSchema,
    billingAddress: addressSchema,
    paymentMethod: {
      type: String,
      required: true,
      enum: ['cod', 'card', 'bank_transfer'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    trackingNumber: String,
    courierName: String,
    estimatedDeliveryDate: Date,
  },
  {
    timestamps: true,
  },
)

// Indexing for faster queries
orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ orderStatus: 1 })

// Recalculate total before saving if not provided
orderSchema.pre('validate', async function () {
  if (this.isModified('items') || this.isModified('shippingFee') || this.isModified('discount')) {
    this.subtotal = this.items.reduce((acc, item) => acc + item.quantity * item.price, 0)
    this.total = this.subtotal + this.shippingFee - this.discount
  }
})

module.exports = mongoose.model('Order', orderSchema)