const cors = require('cors')
const cookieParser = require('cookie-parser')
const express = require('express')
const routes = require('./routes')
const { errorHandler, notFound } = require('./middleware/errorMiddleware')

// Build the Express app separately from server startup so it can be tested and reused.
const app = express()

// Allow requests from the frontend URL configured in .env.
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
)

// Parse JSON and form request bodies before routes receive them.
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint for confirming the API is running.
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Thilani Watch API is running',
    status: 'ok',
  })
})

// Mount all feature routes under one API prefix.
app.use('/api', routes)

// Keep these after routes so unmatched requests and thrown errors are handled last.
app.use(notFound)
app.use(errorHandler)

module.exports = app
