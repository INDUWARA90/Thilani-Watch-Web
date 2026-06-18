const Coupon = require('../models/Coupon')
const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')

/**
 * Validate a coupon code and return its details.
 */
const validateCoupon = asyncHandler(async (req, res, next) => {
  const { code, cartTotal } = req.body

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    startsAt: { $lte: new Date() },
    expiresAt: { $gte: new Date() },
  })

  if (!coupon) {
    return next(new ErrorResponse('Invalid or expired coupon code', 404))
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return next(new ErrorResponse('Coupon usage limit reached', 400))
  }

  if (cartTotal < coupon.minimumOrderAmount) {
    return next(new ErrorResponse(`Minimum order amount of ${coupon.minimumOrderAmount} not met`, 400))
  }

  res.json({
    success: true,
    data: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    },
  })
})

module.exports = { validateCoupon }