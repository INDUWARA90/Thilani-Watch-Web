const Coupon = require('../models/Coupon')
const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const { getPaginationParams, formatPaginatedResponse, escapeRegex } = require('../utils/queryHelpers')

const normalizeCouponPayload = (body) => {
  const payload = {}

  if (body.code !== undefined) payload.code = String(body.code).trim().toUpperCase()
  if (body.discountType !== undefined) payload.discountType = body.discountType
  if (body.discountValue !== undefined) payload.discountValue = Number(body.discountValue)
  if (body.minimumOrderAmount !== undefined) payload.minimumOrderAmount = Number(body.minimumOrderAmount)
  if (body.maxDiscountAmount !== undefined && body.maxDiscountAmount !== '') {
    payload.maxDiscountAmount = Number(body.maxDiscountAmount)
  }
  if (body.startsAt !== undefined) payload.startsAt = body.startsAt
  if (body.expiresAt !== undefined) payload.expiresAt = body.expiresAt
  if (body.usageLimit !== undefined && body.usageLimit !== '') payload.usageLimit = Number(body.usageLimit)
  if (body.perUserLimit !== undefined && body.perUserLimit !== '') payload.perUserLimit = Number(body.perUserLimit)
  if (body.isActive !== undefined) payload.isActive = body.isActive === true || body.isActive === 'true'

  return payload
}

const getCoupons = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query, 20, 100)
  const filter = {}

  if (req.query.search) {
    filter.code = new RegExp(escapeRegex(String(req.query.search).trim()), 'i')
  }

  if (req.query.active === 'true') filter.isActive = true
  if (req.query.active === 'false') filter.isActive = false

  const [coupons, total] = await Promise.all([
    Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Coupon.countDocuments(filter),
  ])

  res.json(formatPaginatedResponse(coupons, total, page, limit))
})

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(normalizeCouponPayload(req.body))
  res.status(201).json({ success: true, data: coupon })
})

const updateCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, normalizeCouponPayload(req.body), {
    new: true,
    runValidators: true,
  })

  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404))
  }

  res.json({ success: true, data: coupon })
})

const deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true, runValidators: true },
  )

  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404))
  }

  res.json({ success: true, data: coupon, message: 'Coupon deactivated' })
})

/**
 * Validate a coupon code and return its details.
 */
const validateCoupon = asyncHandler(async (req, res, next) => {
  const { code, cartTotal } = req.body
  const normalizedCode = String(code || '').trim().toUpperCase()
  const normalizedCartTotal = Number(cartTotal || 0)

  if (!normalizedCode) {
    return next(new ErrorResponse('Coupon code is required', 400))
  }

  const coupon = await Coupon.findOne({
    code: normalizedCode,
    isActive: true,
    startsAt: { $lte: new Date() },
    expiresAt: { $gte: new Date() },
  }).select('+usedBy')

  if (!coupon) {
    return next(new ErrorResponse('Invalid or expired coupon code', 404))
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return next(new ErrorResponse('Coupon usage limit reached', 400))
  }

  const usage = coupon.usedBy.find((entry) => entry.user.toString() === req.user._id.toString())
  if (usage && usage.count >= coupon.perUserLimit) {
    return next(new ErrorResponse('You have already used this coupon', 400))
  }

  if (normalizedCartTotal < coupon.minimumOrderAmount) {
    return next(new ErrorResponse(`Minimum order amount of ${coupon.minimumOrderAmount} not met`, 400))
  }

  res.json({
    success: true,
    data: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      perUserLimit: coupon.perUserLimit,
      remainingUsesForUser: coupon.perUserLimit - (usage?.count || 0),
    },
  })
})

module.exports = {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
  validateCoupon,
}
