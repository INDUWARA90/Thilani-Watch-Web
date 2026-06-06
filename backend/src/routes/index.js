const express = require('express')
const authRoutes = require('./authRoutes')
const watchRoutes = require('./watchRoutes')

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/watches', watchRoutes)

module.exports = router
