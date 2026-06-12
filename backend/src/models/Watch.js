const mongoose = require('mongoose')

const watchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'LKR',
      uppercase: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
      set: (images) => (Array.isArray(images) ? images.filter(Boolean) : []),
    },
    thumbnail: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    collection: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    movementType: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    caseMaterial: {
      type: String,
      default: '',
      trim: true,
    },
    strapMaterial: {
      type: String,
      default: '',
      trim: true,
    },
    waterResistance: {
      type: String,
      default: '',
      trim: true,
    },
    color: {
      type: String,
      default: '',
      trim: true,
    },
    dialColor: {
      type: String,
      default: '',
      trim: true,
    },
    size: {
      type: String,
      default: '',
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    salesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  },
)

watchSchema.index({ isPublished: 1, deletedAt: 1, createdAt: -1 })
watchSchema.index({ category: 1, brand: 1, price: 1 })

watchSchema.pre('validate', function setDerivedWatchFields() {
  if (!this.thumbnail) {
    this.thumbnail = this.images[0] || ''
  }
  this.inStock = this.stockQuantity > 0
})

watchSchema.pre('findOneAndUpdate', function setUpdatedWatchFields() {
  const update = this.getUpdate()  
  const fields = update.$set || update

  if (fields.stockQuantity !== undefined) {
    fields.inStock = fields.stockQuantity > 0
  }

  if (!fields.thumbnail && Array.isArray(fields.images) && fields.images.length > 0) {
    fields.thumbnail = fields.images[0]
  }

  if (!update.$set) {
    this.setUpdate(fields)
  }
})

module.exports = mongoose.model('Watch', watchSchema)
