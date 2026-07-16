const mongoose = require('mongoose')
const Watch = require('../models/Watch')
const Brand = require('../models/Brand')
const Category = require('../models/Category')
const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const {
  escapeRegex,
  parseBoolean,
  getPaginationParams,
  formatPaginatedResponse,
} = require('../utils/queryHelpers')

const DEFAULT_LIMIT = 12
const MAX_LIMIT = 100

const publishedFilter = () => ({
  isPublished: true,
  deletedAt: null,
})

const listSort = (sort) =>
  ({
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    rating: { ratingAverage: -1 },
    popularity: { salesCount: -1 },
  })[sort] || { createdAt: -1 }

const findCatalogIds = async (Model, value) => {
  const rawValue = String(value).trim()
  const exact = new RegExp(`^${escapeRegex(rawValue)}$`, 'i')
  const docs = await Model.find({
    $or: [{ slug: exact }, { name: exact }],
  }).select('_id')

  return docs.map((doc) => doc._id)
}

const buildListFilter = async (query, options = {}) => {
  const { publicOnly = true } = options
  const filter = publicOnly ? publishedFilter() : { deletedAt: null }

  if (query.search) {
    const search = new RegExp(escapeRegex(String(query.search).trim()), 'i')
    const [matchingBrands, matchingCategories] = await Promise.all([
      Brand.find({ $or: [{ name: search }, { slug: search }] }).select('_id'),
      Category.find({ $or: [{ name: search }, { slug: search }] }).select('_id'),
    ])

    filter.$or = [
      { name: search },
      { description: search },
      { shortDescription: search },
      { sku: search },
      { gender: search },
      { strapSize: search },
      { dialSize: search },
    ]

    if (matchingBrands.length > 0) {
      filter.$or.push({ brand: { $in: matchingBrands.map((brand) => brand._id) } })
    }

    if (matchingCategories.length > 0) {
      filter.$or.push({ category: { $in: matchingCategories.map((category) => category._id) } })
    }
  }

  if (query.category) {
    const categoryIds = await findCatalogIds(Category, query.category)
    const rawCategory = String(query.category).trim()
    filter.category = categoryIds.length > 0
      ? { $in: categoryIds }
      : mongoose.Types.ObjectId.isValid(rawCategory)
        ? rawCategory
        : { $in: [] }
  }

  if (query.brand) {
    const brandIds = await findCatalogIds(Brand, query.brand)
    const rawBrand = String(query.brand).trim()
    filter.brand = brandIds.length > 0
      ? { $in: brandIds }
      : mongoose.Types.ObjectId.isValid(rawBrand)
        ? rawBrand
        : { $in: [] }
  }

  const minPrice = Number(query.minPrice)
  const maxPrice = Number(query.maxPrice)

  if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
    filter.price = {}
    if (!Number.isNaN(minPrice)) filter.price.$gte = minPrice
    if (!Number.isNaN(maxPrice)) filter.price.$lte = maxPrice
  }

  const featured = parseBoolean(query.featured)
  if (featured !== undefined) filter.isFeatured = featured

  const stock = parseBoolean(query.stock)
  if (stock !== undefined) filter.inStock = stock

  if (query.gender) {
    filter.gender = String(query.gender).trim().toLowerCase()
  }

  return filter
}

const getWatches = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPaginationParams(req.query, DEFAULT_LIMIT, MAX_LIMIT)
  const filter = await buildListFilter(req.query)

  const [watches, total] = await Promise.all([
    Watch.find(filter)
      .sort(listSort(req.query.sort))
      .skip(skip)
      .limit(limit),
    Watch.countDocuments(filter),
  ])

  res.json(formatPaginatedResponse(watches, total, page, limit))
})

const getAdminWatches = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPaginationParams(req.query, 20, MAX_LIMIT)
  const filter = await buildListFilter(req.query, { publicOnly: false })

  if (req.query.published === 'true') filter.isPublished = true
  if (req.query.published === 'false') filter.isPublished = false

  const [watches, total] = await Promise.all([
    Watch.find(filter)
      .populate('brand', 'name slug')
      .populate('category', 'name slug')
      .sort(listSort(req.query.sort))
      .skip(skip)
      .limit(limit),
    Watch.countDocuments(filter),
  ])

  res.json(formatPaginatedResponse(watches, total, page, limit))
})

const getWatch = asyncHandler(async (req, res, next) => {
  const watch = await Watch.findOne({
    _id: req.params.id,
    ...publishedFilter(),
  })

  if (!watch) {
    return next(new ErrorResponse('Watch not found', 404))
  }

  res.json({ success: true, data: watch })
})

const getWatchBySlug = asyncHandler(async (req, res, next) => {
  const watch = await Watch.findOne({
    slug: req.params.slug,
    ...publishedFilter(),
  })

  if (!watch) {
    return next(new ErrorResponse('Watch not found', 404))
  }

  res.json({ success: true, data: watch })
})

const getFeaturedWatches = asyncHandler(async (req, res, next) => {
  const { limit } = getPaginationParams(req.query, DEFAULT_LIMIT, MAX_LIMIT)
  const watches = await Watch.find({
    ...publishedFilter(),
    isFeatured: true,
  })
    .sort({ createdAt: -1 })
    .limit(limit)

  res.json({ success: true, data: watches })
})

const getNewArrivals = asyncHandler(async (req, res, next) => {
  const { limit } = getPaginationParams(req.query, DEFAULT_LIMIT, MAX_LIMIT)
  const watches = await Watch.find(publishedFilter())
    .sort({ createdAt: -1 })
    .limit(limit)

  res.json({ success: true, data: watches })
})

const getBestSellers = asyncHandler(async (req, res, next) => {
  const { limit } = getPaginationParams(req.query, DEFAULT_LIMIT, MAX_LIMIT)
  const watches = await Watch.find(publishedFilter())
    .sort({ salesCount: -1, createdAt: -1 })
    .limit(limit)

  res.json({ success: true, data: watches })
})

const createWatch = asyncHandler(async (req, res, next) => {
  const watch = await Watch.create(req.body)
  res.status(201).json({ success: true, data: watch })
})

const updateWatch = asyncHandler(async (req, res, next) => {
  const watch = await Watch.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  })

  if (!watch) {
    return next(new ErrorResponse('Watch not found', 404))
  }

  res.json({ success: true, data: watch })
})

const updateWatchStock = asyncHandler(async (req, res, next) => {
  const stockQuantity = Number(req.body.stockQuantity)

  if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
    return next(
      new ErrorResponse('Validation failed', 400, [
        { field: 'stockQuantity', message: 'stockQuantity must be a non-negative integer' },
      ])
    )
  }

  const watch = await Watch.findByIdAndUpdate(
    req.params.id,
    {
      stockQuantity,
      inStock: stockQuantity > 0,
    },
    {
      returnDocument: 'after',
      runValidators: true,
    },
  )

  if (!watch) {
    return next(new ErrorResponse('Watch not found', 404))
  }

  res.json({ success: true, data: watch })
})

/**
 * Admin: Get watches with low stock.
 */
const getLowStockWatches = asyncHandler(async (req, res, next) => {
  const threshold = Number.parseInt(req.query.threshold, 10) || 5
  const watches = await Watch.find({ stockQuantity: { $lte: threshold }, deletedAt: null })
  res.json({ success: true, data: watches })
})

const updateWatchPublish = asyncHandler(async (req, res, next) => {
  const isPublished = parseBoolean(req.body.isPublished)

  if (isPublished === undefined) {
    return next(new ErrorResponse('isPublished must be true or false', 400))
  }

  const watch = await Watch.findByIdAndUpdate(
    req.params.id,
    { isPublished },
    {
      returnDocument: 'after',
      runValidators: true,
    },
  )

  if (!watch) {
    return next(new ErrorResponse('Watch not found', 404))
  }

  res.json({ success: true, data: watch })
})

const deleteWatch = asyncHandler(async (req, res, next) => {
  const watch = await Watch.findByIdAndUpdate(
    req.params.id,
    {
      deletedAt: new Date(),
      isPublished: false,
    },
    { returnDocument: 'after' },
  )

  if (!watch) {
    return next(new ErrorResponse('Watch not found', 404))
  }

  res.json({ success: true, message: 'Watch deleted' })
})

module.exports = {
  createWatch,
  deleteWatch,
  getAdminWatches,
  getBestSellers,
  getFeaturedWatches,
  getNewArrivals,
  getWatch,
  getWatchBySlug,
  getWatches,
  getLowStockWatches,
  updateWatch,
  updateWatchPublish,
  updateWatchStock,
}
