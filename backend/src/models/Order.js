const mongoose = require('mongoose')
const Counter = require('./Counter')

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

const paymentSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ['bank_transfer'],
    },
    transactionId: String,
    amount: Number,
    currency: {
      type: String,
      default: 'LKR',
      uppercase: true,
      trim: true,
    },
    failureReason: String,
  },
  { _id: false },
)

const paymentSlipSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
)

const returnRequestSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['none', 'requested', 'approved', 'rejected', 'received', 'refunded'],
      default: 'none',
    },
    reason: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    requestedAt: Date,
    processedAt: Date,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { _id: false },
)

const refundSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['none', 'pending', 'succeeded', 'failed'],
      default: 'none',
    },
    amount: {
      type: Number,
      default: 0,
    },
    reason: {
      type: String,
      trim: true,
    },
    providerRefundId: String,
    refundedAt: Date,
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    orderNo: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
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
      enum: ['bank_transfer'],
      default: 'bank_transfer',
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    payment: {
      type: paymentSchema,
      default: undefined,
    },
    paymentSlip: {
      type: paymentSlipSchema,
      default: undefined,
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
    wantedDate: Date,
    couponCode: {
      type: String,
      uppercase: true,
      trim: true,
    },
    returnRequest: {
      type: returnRequestSchema,
      default: () => ({ status: 'none' }),
    },
    refund: {
      type: refundSchema,
      default: () => ({ status: 'none', amount: 0 }),
    },
    paidAt: Date,
    paymentFailedAt: Date,
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
orderSchema.index({ paymentStatus: 1 })
orderSchema.index({ 'returnRequest.status': 1 })
orderSchema.index({ createdAt: -1 })

// Recalculate total before saving if not provided
orderSchema.pre('validate', async function () {
  if (this.isNew && !this.orderNo) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'order' },
      { $inc: { value: 1 } },
      { new: true, upsert: true, session: this.$session() },
    )
    this.orderNo = `TWC${counter.value}`
  }

  if (this.isModified('items') || this.isModified('shippingFee') || this.isModified('discount')) {
    this.subtotal = this.items.reduce((acc, item) => acc + item.quantity * item.price, 0)
    this.total = this.subtotal + this.shippingFee - this.discount
  }
})

module.exports = mongoose.model('Order', orderSchema)
