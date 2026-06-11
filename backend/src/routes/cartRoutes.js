const express = require('express')
const {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
} = require('../controllers/cartController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

// All cart operations require the user to be logged in
router.use(protect)

router.route('/')
  .get(getCart)
  .delete(clearCart)

router.route('/items')
  .post(addItem)

router.route('/items/:watchId')
  .put(updateItemQuantity)
  .delete(removeItem)

module.exports = router