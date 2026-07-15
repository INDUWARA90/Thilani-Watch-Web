const Category = require('../models/Category')
const asyncHandler = require('../utils/asyncHandler')
const { buildCatalogPayload } = require('../utils/catalogPayload')
const ErrorResponse = require('../utils/ErrorResponse')

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('sortOrder name')
  res.json({ success: true, data: categories })
})

const getAdminCategories = asyncHandler(async (req, res) => {
  const filter = {}
  if (req.query.active === 'true') filter.isActive = true
  if (req.query.active === 'false') filter.isActive = false

  const categories = await Category.find(filter).sort('sortOrder name')
  res.json({ success: true, data: categories })
})

const createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(buildCatalogPayload(req.body))
  res.status(201).json({ success: true, data: category })
})

const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, buildCatalogPayload(req.body), {
    new: true,
    runValidators: true,
  })
  if (!category) return next(new ErrorResponse('Category not found', 404))
  res.json({ success: true, data: category })
})

const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true, runValidators: true },
  )
  if (!category) return next(new ErrorResponse('Category not found', 404))
  res.json({ success: true, data: category, message: 'Category deactivated' })
})

const restoreCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true, runValidators: true },
  )
  if (!category) return next(new ErrorResponse('Category not found', 404))
  res.json({ success: true, data: category, message: 'Category restored' })
})

module.exports = {
  createCategory,
  deleteCategory,
  getAdminCategories,
  getCategories,
  restoreCategory,
  updateCategory,
}
