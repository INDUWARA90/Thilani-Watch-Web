const express = require('express')
const watchRoutes = require('./watchRoutes')

const router = express.Router()

router.use('/watches', watchRoutes)

module.exports = router
