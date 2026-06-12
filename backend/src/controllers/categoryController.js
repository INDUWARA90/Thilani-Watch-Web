const Category = require('../models/Category')
const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('sortOrder name')
  res.json({ success: true, data: categories })
})

const createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body)
  res.status(201).json({ success: true, data: category })
})

const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!category) return next(new ErrorResponse('Category not found', 404))
  res.json({ success: true, data: category })
})

const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id)
  if (!category) return next(new ErrorResponse('Category not found', 404))
  await category.deleteOne()
  res.json({ success: true, message: 'Category removed' })
})

module.exports = { getCategories, createCategory, updateCategory, deleteCategory }