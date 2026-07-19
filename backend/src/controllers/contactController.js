const ContactMessage = require('../models/ContactMessage')
const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const { getPaginationParams, formatPaginatedResponse, escapeRegex } = require('../utils/queryHelpers')

const normalizeContactPayload = (body) => ({
  name: String(body.name || '').trim(),
  email: String(body.email || '').trim().toLowerCase(),
  phone: body.phone === undefined ? '' : String(body.phone).trim(),
  subject: String(body.subject || '').trim() || 'Contact request',
  message: String(body.message || '').trim(),
})

const createContactMessage = asyncHandler(async (req, res) => {
  const contactMessage = await ContactMessage.create(normalizeContactPayload(req.body))

  res.status(201).json({
    success: true,
    message: 'Contact message submitted successfully',
    data: contactMessage,
  })
})

const getContactMessages = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query, 20, 100)
  const filter = {}

  if (req.query.read === 'true') filter.isRead = true
  if (req.query.read === 'false') filter.isRead = false

  if (req.query.search) {
    const searchRegex = new RegExp(escapeRegex(String(req.query.search).trim()), 'i')
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { subject: searchRegex },
      { message: searchRegex },
    ]
  }

  const [contactMessages, total] = await Promise.all([
    ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ContactMessage.countDocuments(filter),
  ])

  res.json(formatPaginatedResponse(contactMessages, total, page, limit))
})

const getContactMessage = asyncHandler(async (req, res, next) => {
  const contactMessage = await ContactMessage.findById(req.params.id)

  if (!contactMessage) {
    return next(new ErrorResponse('Contact message not found', 404))
  }

  res.json({ success: true, data: contactMessage })
})

const updateContactMessageReadStatus = asyncHandler(async (req, res, next) => {
  const contactMessage = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { isRead: req.body.isRead === true || req.body.isRead === 'true' },
    { new: true, runValidators: true },
  )

  if (!contactMessage) {
    return next(new ErrorResponse('Contact message not found', 404))
  }

  res.json({ success: true, data: contactMessage })
})

const deleteContactMessage = asyncHandler(async (req, res, next) => {
  const contactMessage = await ContactMessage.findByIdAndDelete(req.params.id)

  if (!contactMessage) {
    return next(new ErrorResponse('Contact message not found', 404))
  }

  res.json({ success: true, message: 'Contact message deleted' })
})

module.exports = {
  createContactMessage,
  deleteContactMessage,
  getContactMessage,
  getContactMessages,
  updateContactMessageReadStatus,
}
