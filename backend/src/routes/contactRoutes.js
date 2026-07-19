const express = require('express')
const {
  createContactMessage,
  deleteContactMessage,
  getContactMessage,
  getContactMessages,
  updateContactMessageReadStatus,
} = require('../controllers/contactController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', createContactMessage)
router.get('/', protect, adminOnly, getContactMessages)
router
  .route('/:id')
  .get(protect, adminOnly, getContactMessage)
  .patch(protect, adminOnly, updateContactMessageReadStatus)
  .delete(protect, adminOnly, deleteContactMessage)

module.exports = router
