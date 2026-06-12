const express = require('express')
const { uploadWatchImages, deleteWatchImage } = require('../controllers/uploadController')
const { upload, handleMulterError } = require('../middleware/uploadMiddleware')
const { protect, adminOnly } = require('../middleware/authMiddleware')

const router = express.Router()

router.post(
  '/watch-images',
  protect,
  adminOnly,
  upload.array('images', 5), // Limit to 5 images per watch
  handleMulterError,
  uploadWatchImages,
)

router.delete('/watch-images', protect, adminOnly, deleteWatchImage)

module.exports = router