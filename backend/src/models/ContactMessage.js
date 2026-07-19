const mongoose = require('mongoose')

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [30, 'Phone cannot be more than 30 characters'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [150, 'Subject cannot be more than 150 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot be more than 2000 characters'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

contactMessageSchema.index({ createdAt: -1 })
contactMessageSchema.index({ isRead: 1, createdAt: -1 })

module.exports = mongoose.model('ContactMessage', contactMessageSchema)
