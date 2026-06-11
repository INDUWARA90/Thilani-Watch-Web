const cors = require('cors')
const cookieParser = require('cookie-parser')
const express = require('express')
const routes = require('./routes')
const { errorHandler, notFound } = require('./middleware/errorMiddleware')

// create APP
const app = express()

// allowing cors communication 
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
)
// Middleware
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// check APi that work
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Thilani Watch API is running',
    status: 'ok',
  })
})

// mount the all routes 
app.use('/api', routes)

// Error handling
app.use(notFound)
app.use(errorHandler)

module.exports = app