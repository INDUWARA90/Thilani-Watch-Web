const Watch = require('../models/Watch')
const asyncHandler = require('../utils/asyncHandler')


const getWatches = asyncHandler(async (req, res) => {
  const watches = await Watch.find().sort({ createdAt: -1 })
  res.json(watches)
})

const getWatch = asyncHandler(async (req, res) => {
  const watch = await Watch.findById(req.params.id)

  if (!watch) {
    return res.status(404).json({ message: 'Watch not found' })
  }

  res.json(watch)
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

const deleteWatch = asyncHandler(async (req, res) => {
  const watch = await Watch.findByIdAndDelete(req.params.id)

  if (!watch) {
    return res.status(404).json({ message: 'Watch not found' })
  }

  res.json({ message: 'Watch deleted' })
})

module.exports = {
  createWatch,
  deleteWatch,
  getWatch,
  getWatches,
  updateWatch,
}
