const Order = require('../models/Order')
const Watch = require('../models/Watch')
const Cart = require('../models/Cart')
const Coupon = require('../models/Coupon')
const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')

/**
 * Create a new order from current cart or direct items.
 * Validates stock and reduces inventory on success.
 */
const createOrder = asyncHandler(async (req, res, next) => {
  const { shippingAddress, billingAddress, paymentMethod, notes } = req.body

  // 1. Fetch user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.watch')
  if (!cart || cart.items.length === 0) {
    return next(new ErrorResponse('Cart is empty', 400))
  }

  // 2. Validate stock for all items
  for (const item of cart.items) {
    const watch = item.watch
    if (!watch || !watch.isPublished || watch.deletedAt) {
      return next(new ErrorResponse(`Watch ${watch?.name || 'Unknown'} is no longer available.`, 400))
    }
    if (item.quantity > watch.stockQuantity) {
      return next(
        new ErrorResponse(`Insufficient stock for ${watch.name}. Only ${watch.stockQuantity} left.`, 400)
      )
    }
  }

  // 3. Prepare order items snapshot
  const orderItems = cart.items.map((item) => ({
    watch: item.watch._id,
    name: item.watch.name,
    sku: item.watch.sku,
    quantity: item.quantity,
    price: item.watch.price, // Use current price from DB, not from cart request
  }))

  // 4. Calculate Discount from Coupon
  const { couponCode } = req.body
  let discount = 0
  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
      startsAt: { $lte: new Date() },
      expiresAt: { $gte: new Date() },
    })

    if (coupon) {
      const subtotal = cart.items.reduce((acc, item) => acc + item.quantity * item.watch.price, 0)
      if (subtotal >= coupon.minimumOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discount = (subtotal * coupon.discountValue) / 100
          if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount)
        } else {
          discount = coupon.discountValue
        }
        discount = Math.min(discount, subtotal)
        coupon.usedCount += 1
        await coupon.save()
      }
    }
  }

  // 5. Create Order
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    paymentMethod,
    discount,
    notes,
    shippingFee: 500, // Example static fee, logic can be added here
  })

  // 6. Reduce stock for each watch
  const stockUpdates = cart.items.map((item) =>
    Watch.findByIdAndUpdate(item.watch._id, {
      $inc: { stockQuantity: -item.quantity, salesCount: item.quantity },
    }),
  )
  await Promise.all(stockUpdates)

  // 7. Clear user's cart
  await Cart.findOneAndDelete({ user: req.user._id })

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
      $inc: { stockQuantity: item.quantity, salesCount: Math.max(0, -item.quantity) },
    }),
  )
  await Promise.all(restoreUpdates)

  res.json({ success: true, data: order, message: 'Order cancelled and stock restored' })
})

/**
 * Admin: Get all orders.
 */
const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 })
  res.json({ success: true, data: orders })
})

/**
 * Admin: Update order status.
 */
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderStatus } = req.body
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus, [orderStatus === 'shipped' ? 'shippedAt' : 'deliveredAt']: new Date() },
    { new: true, runValidators: true },
  )

  if (!order) return next(new ErrorResponse('Order not found', 404))
  res.json({ success: true, data: order })
})

/**
 * Admin: Update shipping and tracking information.
 */
const updateOrderShipping = asyncHandler(async (req, res, next) => {
  const { trackingNumber, courierName, estimatedDeliveryDate, orderStatus } = req.body

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      trackingNumber,
      courierName,
      estimatedDeliveryDate,
      orderStatus: orderStatus || 'shipped',
      shippedAt: orderStatus === 'shipped' ? new Date() : undefined,
    },
    { new: true, runValidators: true }
  )

  if (!order) return next(new ErrorResponse('Order not found', 404))
  res.json({ success: true, data: order })
})

/**
 * Admin: Update payment status.
 */
const updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const { paymentStatus } = req.body
  const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus }, { new: true, runValidators: true })

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
}