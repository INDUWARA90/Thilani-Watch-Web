const express = require('express')
const router = express.Router()
const {
  getCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
} = require('../controllers/categoryController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.route('/')
  .get(getCategories)
  .post(protect, adminOnly, createCategory)

router.get('/admin/all', protect, adminOnly, getAdminCategories)
router.patch('/:id/restore', protect, adminOnly, restoreCategory)

router.route('/:id')
  .put(protect, adminOnly, updateCategory)
  .delete(protect, adminOnly, deleteCategory)

module.exports = router
