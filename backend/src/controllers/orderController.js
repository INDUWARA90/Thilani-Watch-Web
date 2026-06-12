const Order = require('../models/Order')
const Watch = require('../models/Watch')
const Cart = require('../models/Cart')
const asyncHandler = require('../utils/asyncHandler')

/**
 * Create a new order from current cart or direct items.
 * Validates stock and reduces inventory on success.
 */
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, billingAddress, paymentMethod, notes } = req.body

  // 1. Fetch user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.watch')
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' })
  }

  // 2. Validate stock for all items
  for (const item of cart.items) {
    const watch = item.watch
    if (!watch || !watch.isPublished || watch.deletedAt) {
      return res.status(400).json({ message: `Watch ${watch?.name || 'Unknown'} is no longer available.` })
    }
    if (item.quantity > watch.stockQuantity) {
      return res.status(400).json({ message: `Insufficient stock for ${watch.name}. Only ${watch.stockQuantity} left.` })
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

  // 4. Create Order
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    paymentMethod,
    notes,
    shippingFee: 500, // Example static fee, logic can be added here
  })

  // 5. Reduce stock for each watch
  const stockUpdates = cart.items.map((item) =>
    Watch.findByIdAndUpdate(item.watch._id, {
      $inc: { stockQuantity: -item.quantity, salesCount: item.quantity },
    }),
  )
  await Promise.all(stockUpdates)

  // 6. Clear user's cart
  await Cart.findOneAndDelete({ user: req.user._id })

  res.status(201).json(order)
})

/**
 * Get logged-in user's order history.
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json(orders)
})

/**
 * Get single order details. Customers can only see their own.
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email')

  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }

  // Restriction: Only owner or admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to view this order' })
  }

  res.json(order)
})

/**
 * Customer cancels an order before it's shipped.
 */
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })

  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }

  if (!['pending', 'confirmed'].includes(order.orderStatus)) {
    return res.status(400).json({ message: `Cannot cancel order in ${order.orderStatus} status.` })
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

  res.json({ message: 'Order cancelled and stock restored', order })
})

/**
 * Admin: Get all orders.
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 })
  res.json(orders)
})

/**
 * Admin: Update order status.
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus, [orderStatus === 'shipped' ? 'shippedAt' : 'deliveredAt']: new Date() },
    { new: true, runValidators: true },
  )

  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.json(order)
})

/**
 * Admin: Update payment status.
 */
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body
  const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus }, { new: true, runValidators: true })

  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.json(order)
})

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
}