const Brand = require('../models/Brand')
const asyncHandler = require('../utils/asyncHandler')
const { buildCatalogPayload } = require('../utils/catalogPayload')
const ErrorResponse = require('../utils/ErrorResponse')
const { clearPublicCache } = require('../middleware/cacheMiddleware')

const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({ isActive: true }).sort('sortOrder name').lean()
  res.json({ success: true, data: brands })
})

const getAdminBrands = asyncHandler(async (req, res) => {
  const filter = {}
  if (req.query.active === 'true') filter.isActive = true
  if (req.query.active === 'false') filter.isActive = false

  const brands = await Brand.find(filter).sort('sortOrder name').lean()
  res.json({ success: true, data: brands })
})

const createBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.create(buildCatalogPayload(req.body))
  clearPublicCache()
  res.status(201).json({ success: true, data: brand })
})

const updateBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, buildCatalogPayload(req.body), {
    new: true,
    runValidators: true,
  })
  if (!brand) return next(new ErrorResponse('Brand not found', 404))
  clearPublicCache()
  res.json({ success: true, data: brand })
})

const deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true, runValidators: true },
  )
  if (!brand) return next(new ErrorResponse('Brand not found', 404))
  clearPublicCache()
  res.json({ success: true, data: brand, message: 'Brand deactivated' })
})

const restoreBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true, runValidators: true },
  )
  if (!brand) return next(new ErrorResponse('Brand not found', 404))
  clearPublicCache()
  res.json({ success: true, data: brand, message: 'Brand restored' })
})

module.exports = {
  createBrand,
  deleteBrand,
  getAdminBrands,
  getBrands,
  restoreBrand,
  updateBrand,
}
