const User = require('../models/User')
const Order = require('../models/Order')
const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const { getPaginationParams, formatPaginatedResponse, escapeRegex } = require('../utils/queryHelpers')

const getCustomers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query, 20, 100)
  const filter = { role: 'customer' }

  if (req.query.search) {
    const search = new RegExp(escapeRegex(String(req.query.search).trim()), 'i')
    filter.$or = [{ name: search }, { email: search }, { phone: search }]
  }

  const active = req.query.active
  if (active === 'true') filter.isActive = true
  if (active === 'false') filter.isActive = false

  const [customers, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ])

  res.json(formatPaginatedResponse(customers, total, page, limit))
})

const getCustomerById = asyncHandler(async (req, res, next) => {
  const customer = await User.findOne({ _id: req.params.id, role: 'customer' })

  if (!customer) {
    return next(new ErrorResponse('Customer not found', 404))
  }

  res.json({ success: true, data: customer })
})

const updateCustomerStatus = asyncHandler(async (req, res, next) => {
  if (typeof req.body.isActive !== 'boolean') {
    return next(new ErrorResponse('isActive must be true or false', 400))
  }

  const customer = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'customer' },
    { isActive: req.body.isActive },
    { new: true, runValidators: true },
  )

  if (!customer) {
    return next(new ErrorResponse('Customer not found', 404))
  }

  res.json({ success: true, data: customer })
})

const getCustomerOrders = asyncHandler(async (req, res, next) => {
  const customer = await User.findOne({ _id: req.params.id, role: 'customer' })

  if (!customer) {
    return next(new ErrorResponse('Customer not found', 404))
  }

  const orders = await Order.find({ user: customer._id }).sort({ createdAt: -1 })
  res.json({ success: true, data: orders })
})

module.exports = {
  getCustomerById,
  getCustomerOrders,
  getCustomers,
  updateCustomerStatus,
}
