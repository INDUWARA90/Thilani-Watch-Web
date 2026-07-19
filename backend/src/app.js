const cors = require('cors')
const cookieParser = require('cookie-parser')
const express = require('express')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const hpp = require('hpp')
const morgan = require('morgan')
const routes = require('./routes/index')
const { errorHandler, notFound } = require('./middleware/errorMiddleware')

// create APP
const app = express()
app.set('trust proxy', 1)

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
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')) // Log requests to console
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
})

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
app.use('/api/auth', authLimiter)
app.use('/api', apiLimiter)
app.use('/api', routes)

// Error handling
app.use(notFound)
app.use(errorHandler)

module.exports = app
