const mongoose = require('mongoose')
const Order = require('../models/Order')
const Watch = require('../models/Watch')
const Cart = require('../models/Cart')
const Coupon = require('../models/Coupon')
const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const { getPaginationParams, formatPaginatedResponse } = require('../utils/queryHelpers')
const { sendOrderConfirmationEmail, sendShippingUpdateEmail } = require('../services/emailService')

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded']
const RETURN_STATUSES = ['approved', 'rejected', 'received', 'refunded']

const getCouponDiscount = (coupon, subtotal) => {
  let discount = 0
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100
    if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount)
  } else {
    discount = coupon.discountValue
  }

  return Math.min(discount, subtotal)
}

const markCouponUsed = (coupon, userId) => {
  const usage = coupon.usedBy.find((entry) => entry.user.toString() === userId.toString())
  if (usage) {
    usage.count += 1
    usage.lastUsedAt = new Date()
  } else {
    coupon.usedBy.push({ user: userId, count: 1, lastUsedAt: new Date() })
  }
  coupon.usedCount += 1
}

const getPaymentSlipPayload = (paymentSlip) => {
  if (!paymentSlip || typeof paymentSlip !== 'object') return null

  const url = paymentSlip.url ? String(paymentSlip.url).trim() : ''
  const publicId = paymentSlip.publicId ? String(paymentSlip.publicId).trim() : ''

  if (!url || !publicId) return null

  return { url, publicId }
}

const initializeOrderPayment = async (order) => {
  order.payment = {
    provider: 'bank_transfer',
    amount: order.total,
    currency: 'LKR',
  }
  order.paymentStatus = 'pending'
  await order.save()
  return order
}

/**
 * Create a new order from current cart or direct items.
 * Validates stock and reduces inventory on success.
 */
const createOrder = asyncHandler(async (req, res, next) => {
  const { shippingAddress, billingAddress, paymentMethod, paymentSlip, notes } = req.body
  const normalizedPaymentMethod = paymentMethod ? String(paymentMethod).trim().toLowerCase() : 'bank_transfer'

  if (normalizedPaymentMethod !== 'bank_transfer') {
    return next(new ErrorResponse('Only bank transfer payment is available', 400))
  }

  const normalizedPaymentSlip = getPaymentSlipPayload(paymentSlip)
  if (!normalizedPaymentSlip) {
    return next(new ErrorResponse('Payment slip url and publicId are required', 400))
  }

  const session = await mongoose.startSession()
  let order
  let committed = false

  try {
    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ user: req.user._id }).session(session).populate('items.watch')
      if (!cart || cart.items.length === 0) {
        throw new ErrorResponse('Cart is empty', 400)
      }

      for (const item of cart.items) {
        const watch = item.watch
        if (!watch || !watch.isPublished || watch.deletedAt) {
          throw new ErrorResponse(`Watch ${watch?.name || 'Unknown'} is no longer available.`, 400)
        }
        if (item.quantity > watch.stockQuantity) {
          throw new ErrorResponse(`Insufficient stock for ${watch.name}. Only ${watch.stockQuantity} left.`, 400)
        }
      }

      const orderItems = cart.items.map((item) => ({
        watch: item.watch._id,
        name: item.watch.name,
        sku: item.watch.sku,
        quantity: item.quantity,
        price: item.watch.price,
      }))

      const subtotal = cart.items.reduce((acc, item) => acc + item.quantity * item.watch.price, 0)
      const normalizedCouponCode = req.body.couponCode ? String(req.body.couponCode).trim().toUpperCase() : ''
      let discount = 0

      if (normalizedCouponCode) {
        const coupon = await Coupon.findOne({
          code: normalizedCouponCode,
          isActive: true,
          startsAt: { $lte: new Date() },
          expiresAt: { $gte: new Date() },
        })
          .select('+usedBy')
          .session(session)

        if (!coupon) {
          throw new ErrorResponse('Invalid or expired coupon code', 400)
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
          throw new ErrorResponse('Coupon usage limit reached', 400)
        }

        const usage = coupon.usedBy.find((entry) => entry.user.toString() === req.user._id.toString())
        if (usage && usage.count >= coupon.perUserLimit) {
          throw new ErrorResponse('You have already used this coupon', 400)
        }

        if (subtotal < coupon.minimumOrderAmount) {
          throw new ErrorResponse(`Minimum order amount of ${coupon.minimumOrderAmount} not met`, 400)
        }

        discount = getCouponDiscount(coupon, subtotal)
        markCouponUsed(coupon, req.user._id)
        await coupon.save({ session })
      }

      const createdOrders = await Order.create(
        [
          {
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            paymentMethod: normalizedPaymentMethod,
            paymentSlip: normalizedPaymentSlip,
            discount,
            notes,
            couponCode: normalizedCouponCode || undefined,
            shippingFee: 500,
          },
        ],
        { session },
      )
      order = createdOrders[0]

      for (const item of cart.items) {
        const stockUpdate = await Watch.updateOne(
          {
            _id: item.watch._id,
            isPublished: true,
            deletedAt: null,
            stockQuantity: { $gte: item.quantity },
          },
          {
            $inc: { stockQuantity: -item.quantity, salesCount: item.quantity },
            $set: { inStock: item.watch.stockQuantity - item.quantity > 0 },
          },
          { session },
        )

        if (stockUpdate.modifiedCount !== 1) {
          throw new ErrorResponse(`Insufficient stock for ${item.watch.name}.`, 400)
        }
      }

      await Cart.deleteOne({ user: req.user._id }, { session })
    })
    committed = true
  } finally {
    await session.endSession()
  }

  if (!committed || !order) {
    return next(new ErrorResponse('Unable to create order', 500))
  }

  try {
    order = await initializeOrderPayment(order, req.user)
  } catch (error) {
    order.paymentStatus = 'failed'
    order.paymentFailedAt = new Date()
    order.payment = {
      provider: 'bank_transfer',
      amount: order.total,
      currency: 'LKR',
      failureReason: error.message,
    }
    await order.save()
    throw error
  }

  await sendOrderConfirmationEmail(req.user, order)
  res.status(201).json({ success: true, data: order })
})

/**
 * Get logged-in user's order history.
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json({ success: true, data: orders })
})

/**
 * Get single order details. Customers can only see their own.
 */
const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email')

  if (!order) {
    return next(new ErrorResponse('Order not found', 404))
  }

  // Restriction: Only owner or admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view this order', 403))
  }

  res.json({ success: true, data: order })
})

/**
 * Customer cancels an order before it's shipped.
 */
const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })

  if (!order) {
    return next(new ErrorResponse('Order not found', 404))
  }

  if (!['pending', 'confirmed'].includes(order.orderStatus)) {
    return next(new ErrorResponse(`Cannot cancel order in ${order.orderStatus} status.`, 400))
  }

  order.orderStatus = 'cancelled'
  order.cancelledAt = new Date()
  await order.save()

  // Restore stock
  const restoreUpdates = order.items.map((item) =>
    Watch.findByIdAndUpdate(item.watch, {
      $inc: { stockQuantity: item.quantity, salesCount: -item.quantity },
    }),
  )
  await Promise.all(restoreUpdates)

  res.json({ success: true, data: order, message: 'Order cancelled and stock restored' })
})

const requestReturn = asyncHandler(async (req, res, next) => {
  const { reason, notes } = req.body
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })

  if (!order) return next(new ErrorResponse('Order not found', 404))
  if (order.orderStatus !== 'delivered') {
    return next(new ErrorResponse('Returns can only be requested for delivered orders', 400))
  }
  if (order.returnRequest?.status && order.returnRequest.status !== 'none') {
    return next(new ErrorResponse('Return has already been requested for this order', 400))
  }

  order.returnRequest = {
    status: 'requested',
    reason,
    notes,
    requestedAt: new Date(),
  }
  await order.save()

  res.json({ success: true, data: order, message: 'Return requested' })
})

/**
 * Admin: Get all orders.
 */
const getAllOrders = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPaginationParams(req.query, 20, 100)
  const filter = {}

  if (req.query.orderStatus) filter.orderStatus = req.query.orderStatus
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus
  if (req.query.user) filter.user = req.query.user

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ])

  res.json(formatPaginatedResponse(orders, total, page, limit))
})

/**
 * Admin: Update order status.
 */
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderStatus } = req.body

  if (!ORDER_STATUSES.includes(orderStatus)) {
    return next(new ErrorResponse('Invalid order status', 400))
  }

  const update = { orderStatus }
  if (orderStatus === 'shipped') update.shippedAt = new Date()
  if (orderStatus === 'delivered') update.deliveredAt = new Date()
  if (orderStatus === 'cancelled') update.cancelledAt = new Date()

  const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).populate(
    'user',
    'name email',
  )

  if (!order) return next(new ErrorResponse('Order not found', 404))
  if (['shipped', 'delivered'].includes(orderStatus)) {
    await sendShippingUpdateEmail(order.user, order)
  }
  res.json({ success: true, data: order })
})

/**
 * Admin: Update shipping and tracking information.
 */
const updateOrderShipping = asyncHandler(async (req, res, next) => {
  const { trackingNumber, courierName, estimatedDeliveryDate, orderStatus } = req.body
  const nextStatus = orderStatus || 'shipped'

  if (!ORDER_STATUSES.includes(nextStatus)) {
    return next(new ErrorResponse('Invalid order status', 400))
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      trackingNumber,
      courierName,
      estimatedDeliveryDate,
      orderStatus: nextStatus,
      ...(nextStatus === 'shipped' ? { shippedAt: new Date() } : {}),
      ...(nextStatus === 'delivered' ? { deliveredAt: new Date() } : {}),
    },
    { new: true, runValidators: true }
  ).populate('user', 'name email')

  if (!order) return next(new ErrorResponse('Order not found', 404))
  await sendShippingUpdateEmail(order.user, order)
  res.json({ success: true, data: order })
})

/**
 * Admin: Update payment status.
 */
const updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const { paymentStatus } = req.body

  if (!PAYMENT_STATUSES.includes(paymentStatus)) {
    return next(new ErrorResponse('Invalid payment status', 400))
  }

  const update = { paymentStatus }
  if (paymentStatus === 'paid') update.paidAt = new Date()
  if (paymentStatus === 'failed') update.paymentFailedAt = new Date()

  const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })

  if (!order) return next(new ErrorResponse('Order not found', 404))
  res.json({ success: true, data: order })
})

/**
 * Confirm payment for an order.
 */
const confirmPayment = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if (!order) return next(new ErrorResponse('Order not found', 404))

  order.paymentStatus = 'paid'
  order.paidAt = new Date()
  if (req.body?.transactionId) order.payment = { ...(order.payment || {}), transactionId: req.body.transactionId }
  await order.save()
  res.json({ success: true, data: order })
})

const processReturn = asyncHandler(async (req, res, next) => {
  const { status, notes } = req.body
  if (!RETURN_STATUSES.includes(status)) {
    return next(new ErrorResponse('Invalid return status', 400))
  }

  const order = await Order.findById(req.params.id)
  if (!order) return next(new ErrorResponse('Order not found', 404))
  if (!order.returnRequest || order.returnRequest.status === 'none') {
    return next(new ErrorResponse('Return has not been requested for this order', 400))
  }

  order.returnRequest.status = status
  order.returnRequest.notes = notes || order.returnRequest.notes
  order.returnRequest.processedAt = new Date()
  order.returnRequest.processedBy = req.user._id
  await order.save()

  res.json({ success: true, data: order })
})

const refundOrder = asyncHandler(async (req, res, next) => {
  const { amount, reason } = req.body
  const order = await Order.findById(req.params.id)

  if (!order) return next(new ErrorResponse('Order not found', 404))
  if (order.paymentStatus !== 'paid') {
    return next(new ErrorResponse('Only paid orders can be refunded', 400))
  }

  const refundAmount = amount !== undefined ? Number(amount) : order.total
  if (!refundAmount || refundAmount <= 0 || refundAmount > order.total) {
    return next(new ErrorResponse('Refund amount must be greater than 0 and less than or equal to order total', 400))
  }

  order.refund = {
    status: 'succeeded',
    amount: refundAmount,
    reason,
    providerRefundId: `bank_transfer_refund_${order._id}_${Date.now()}`,
    refundedAt: new Date(),
  }

  if (refundAmount >= order.total) {
    order.paymentStatus = 'refunded'
    if (order.returnRequest?.status && order.returnRequest.status !== 'none') {
      order.returnRequest.status = 'refunded'
      order.returnRequest.processedAt = new Date()
      order.returnRequest.processedBy = req.user._id
    }
  }

  await order.save()
  res.json({ success: true, data: order })
})

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  updateOrderShipping,
  updatePaymentStatus,
  confirmPayment,
  processReturn,
  refundOrder,
  requestReturn,
}
