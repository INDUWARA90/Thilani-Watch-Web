const express = require('express')
const {
  createWatch,
  deleteWatch,
  getWatch,
  getWatches,
  updateWatch,
} = require('../controllers/watchController')

const router = express.Router()


router.route('/').get(getWatches).post(createWatch)

router.route('/:id').get(getWatch).put(updateWatch).delete(deleteWatch)

module.exports = router
