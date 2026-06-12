const express = require('express')
const router = express.Router()
const {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../controllers/brandController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.route('/')
  .get(getBrands)
  .post(protect, adminOnly, createBrand)

router.route('/:id')
  .put(protect, adminOnly, updateBrand)
  .delete(protect, adminOnly, deleteBrand)

module.exports = router