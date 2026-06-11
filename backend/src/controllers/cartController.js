const Cart = require('../models/Cart')
const Watch = require('../models/Watch')
const asyncHandler = require('../utils/asyncHandler')

/**
 * Returns the current user's cart.
 * Creates an empty cart if one doesn't exist.
 */
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.watch')

  if (!cart) {
    // Return a virtual empty cart structure for frontend consistency
    return res.json({
      user: req.user._id,
      items: [],
      subtotal: 0,
    })
  }

  res.json(cart)
})

/**
 * Adds an item to the cart or increases quantity if it exists.
 */
const addItem = asyncHandler(async (req, res) => {
  const { watchId, quantity } = req.body
  const qty = Math.max(1, Number.parseInt(quantity, 10) || 1)

  const watch = await Watch.findOne({
    _id: watchId,
    isPublished: true,
    deletedAt: null,
  })

  if (!watch) {
    return res.status(404).json({ message: 'Watch not found or unavailable' })
  }

  if (qty > watch.stockQuantity) {
    return res.status(400).json({ message: `Insufficient stock. Only ${watch.stockQuantity} available.` })
  }

  let cart = await Cart.findOne({ user: req.user._id })

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] })
  }

  const existingItem = cart.items.find((item) => item.watch.toString() === watchId)

  if (existingItem) {
    const totalRequested = existingItem.quantity + qty
    if (totalRequested > watch.stockQuantity) {
      return res.status(400).json({
        message: `Cannot add more. You have ${existingItem.quantity} in cart and only ${watch.stockQuantity} are in stock.`,
      })
    }
    existingItem.quantity = totalRequested
  } else {
    cart.items.push({
      watch: watchId,
      quantity: qty,
      priceAtTime: watch.price,
    })
  }

  await cart.save()
  const populatedCart = await cart.populate('items.watch')
  res.json(populatedCart)
})

/**
 * Updates the quantity of a specific item in the cart.
 */
const updateItemQuantity = asyncHandler(async (req, res) => {
  const { watchId } = req.params
  const { quantity } = req.body
  const qty = Number.parseInt(quantity, 10)

  if (!qty || qty < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1' })
  }

  const [watch, cart] = await Promise.all([
    Watch.findOne({ _id: watchId, isPublished: true, deletedAt: null }),
    Cart.findOne({ user: req.user._id }),
  ])

  if (!watch || !cart) {
    return res.status(404).json({ message: 'Cart or watch not found' })
  }

  if (qty > watch.stockQuantity) {
    return res.status(400).json({ message: `Only ${watch.stockQuantity} items in stock` })
  }

  const item = cart.items.find((i) => i.watch.toString() === watchId)
  if (!item) {
    return res.status(404).json({ message: 'Item not found in cart' })
  }

  item.quantity = qty
  await cart.save()
  const populatedCart = await cart.populate('items.watch')
  res.json(populatedCart)
})

/**
 * Removes an item from the cart.
 */
const removeItem = asyncHandler(async (req, res) => {
  const { watchId } = req.params
  const cart = await Cart.findOne({ user: req.user._id })

  if (cart) {
    cart.items = cart.items.filter((item) => item.watch.toString() !== watchId)
    await cart.save()
  }

  const populatedCart = await cart?.populate('items.watch') || { items: [], subtotal: 0 }
  res.json(populatedCart)
})

/**
 * Clears all items from the user's cart.
 */
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id })
  res.json({ message: 'Cart cleared', items: [], subtotal: 0 })
})

module.exports = {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
}