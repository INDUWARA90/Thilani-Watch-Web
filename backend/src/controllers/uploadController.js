const cloudinary = require('../config/cloudinary')
const asyncHandler = require('../utils/asyncHandler')

/**
 * Upload multiple watch images.
 * Multer handles the Cloudinary upload; this returns the result.
 */
const uploadWatchImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Please upload at least one image' })
  }

  const images = req.files.map((file) => ({
    url: file.path,
    publicId: file.filename,
  }))

  res.status(200).json({
    message: 'Images uploaded successfully',
    images,
  })
})

/**
 * Delete an image from Cloudinary.
 */
const deleteWatchImage = asyncHandler(async (req, res) => {
  const { publicId } = req.body

  if (!publicId) {
    return res.status(400).json({ message: 'Public ID is required for deletion' })
  }

  const result = await cloudinary.uploader.destroy(publicId)

  if (result.result !== 'ok') {
    return res.status(400).json({ message: 'Failed to delete image', result })
  }

  res.status(200).json({ message: 'Image deleted successfully' })
})

module.exports = {
  uploadWatchImages,
  deleteWatchImage,
}