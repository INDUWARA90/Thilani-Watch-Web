const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

brandSchema.index({ isActive: 1, sortOrder: 1, name: 1 })

module.exports = mongoose.model('Brand', brandSchema)
