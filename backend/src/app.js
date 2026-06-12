const cors = require('cors')
const cookieParser = require('cookie-parser')
const express = require('express')
const helmet = require('helmet')
const hpp = require('hpp')
const morgan = require('morgan')
const routes = require('./routes/index')
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

// Security & Logging Middleware
app.use(helmet()) // Set security HTTP headers
app.use(hpp()) // Prevent HTTP Parameter Pollution
app.use(morgan('dev')) // Log requests to console

// Standard Middleware
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