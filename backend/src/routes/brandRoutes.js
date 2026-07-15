const express = require('express')
const router = express.Router()
const {
  getBrands,
  getAdminBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  restoreBrand,
} = require('../controllers/brandController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.route('/')
  .get(getBrands)
  .post(protect, adminOnly, createBrand)

router.get('/admin/all', protect, adminOnly, getAdminBrands)
router.patch('/:id/restore', protect, adminOnly, restoreBrand)

router.route('/:id')
  .put(protect, adminOnly, updateBrand)
  .delete(protect, adminOnly, deleteBrand)

module.exports = router
