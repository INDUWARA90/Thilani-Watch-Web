const Brand = require('../models/Brand')
const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')

const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({ isActive: true }).sort('sortOrder name')
  res.json({ success: true, data: brands })
})

const createBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.create(req.body)
  res.status(201).json({ success: true, data: brand })
})

const updateBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!brand) return next(new ErrorResponse('Brand not found', 404))
  res.json({ success: true, data: brand })
})

const deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id)
  if (!brand) return next(new ErrorResponse('Brand not found', 404))
  await brand.deleteOne()
  res.json({ success: true, message: 'Brand removed' })
})

module.exports = { getBrands, createBrand, updateBrand, deleteBrand }