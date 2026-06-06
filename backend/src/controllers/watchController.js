const Watch = require('../models/Watch')
const asyncHandler = require('../utils/asyncHandler')

const DEFAULT_LIMIT = 12
const MAX_LIMIT = 100

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const positiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

const booleanValue = (value) => {
  if (value === true || value === 'true') return true
  if (value === false || value === 'false') return false
  return undefined
}

const publishedFilter = () => ({
  isPublished: true,
  deletedAt: null,
})

const listLimit = (value) => Math.min(positiveInteger(value, DEFAULT_LIMIT), MAX_LIMIT)

const listSort = (sort) =>
  ({
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
  })[sort] || { createdAt: -1 }

const buildListFilter = (query) => {
  const filter = publishedFilter()

  if (query.search) {
    const search = new RegExp(escapeRegex(String(query.search).trim()), 'i')
    filter.$or = [
      { name: search },
      { brand: search },
      { description: search },
      { shortDescription: search },
      { sku: search },
    ]
  }

  if (query.category) {
    filter.category = String(query.category).trim().toLowerCase()
  }

  if (query.brand) {
    filter.brand = new RegExp(`^${escapeRegex(String(query.brand).trim())}$`, 'i')
  }

  const minPrice = Number(query.minPrice)
  const maxPrice = Number(query.maxPrice)

  if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
    filter.price = {}
    if (!Number.isNaN(minPrice)) filter.price.$gte = minPrice
    if (!Number.isNaN(maxPrice)) filter.price.$lte = maxPrice
  }

  const featured = booleanValue(query.featured)
  if (featured !== undefined) filter.isFeatured = featured

  const stock = booleanValue(query.stock)
  if (stock !== undefined) filter.inStock = stock

  return filter
}

const getWatches = asyncHandler(async (req, res) => {
  const page = positiveInteger(req.query.page, 1)
  const limit = listLimit(req.query.limit)
  const filter = buildListFilter(req.query)

  const [watches, total] = await Promise.all([
    Watch.find(filter)
      .sort(listSort(req.query.sort))
      .skip((page - 1) * limit)
      .limit(limit),
    Watch.countDocuments(filter),
  ])

  res.json({
    watches,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
})

const getWatch = asyncHandler(async (req, res) => {
  const watch = await Watch.findOne({
    _id: req.params.id,
    ...publishedFilter(),
  })

  if (!watch) {
    return res.status(404).json({ message: 'Watch not found' })
  }

  res.json(watch)
})

const getWatchBySlug = asyncHandler(async (req, res) => {
  const watch = await Watch.findOne({
    slug: req.params.slug,
    ...publishedFilter(),
  })

  if (!watch) {
    return res.status(404).json({ message: 'Watch not found' })
  }

  res.json(watch)
})

const getFeaturedWatches = asyncHandler(async (req, res) => {
  const watches = await Watch.find({
    ...publishedFilter(),
    isFeatured: true,
  })
    .sort({ createdAt: -1 })
    .limit(listLimit(req.query.limit))

  res.json(watches)
})

const getNewArrivals = asyncHandler(async (req, res) => {
  const watches = await Watch.find(publishedFilter())
    .sort({ createdAt: -1 })
    .limit(listLimit(req.query.limit))

  res.json(watches)
})

const getBestSellers = asyncHandler(async (req, res) => {
  const watches = await Watch.find(publishedFilter())
    .sort({ salesCount: -1, createdAt: -1 })
    .limit(listLimit(req.query.limit))

  res.json(watches)
})

const createWatch = asyncHandler(async (req, res) => {
  const watch = await Watch.create(req.body)
  res.status(201).json(watch)
})

const updateWatch = asyncHandler(async (req, res) => {
  const watch = await Watch.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  })

  if (!watch) {
    return res.status(404).json({ message: 'Watch not found' })
  }

  res.json(watch)
})

const updateWatchStock = asyncHandler(async (req, res) => {
  const stockQuantity = Number(req.body.stockQuantity)

  if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
    return res.status(400).json({ message: 'stockQuantity must be a non-negative integer' })
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
    return res.status(404).json({ message: 'Watch not found' })
  }

  res.json(watch)
})

const updateWatchPublish = asyncHandler(async (req, res) => {
  const isPublished = booleanValue(req.body.isPublished)

  if (isPublished === undefined) {
    return res.status(400).json({ message: 'isPublished must be true or false' })
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
    return res.status(404).json({ message: 'Watch not found' })
  }

  res.json(watch)
})

const deleteWatch = asyncHandler(async (req, res) => {
  const watch = await Watch.findByIdAndUpdate(
    req.params.id,
    {
      deletedAt: new Date(),
      isPublished: false,
    },
    { returnDocument: 'after' },
  )

  if (!watch) {
    return res.status(404).json({ message: 'Watch not found' })
  }

  res.json({ message: 'Watch deleted' })
})

module.exports = {
  createWatch,
  deleteWatch,
  getBestSellers,
  getFeaturedWatches,
  getNewArrivals,
  getWatch,
  getWatchBySlug,
  getWatches,
  updateWatch,
  updateWatchPublish,
  updateWatchStock,
}
