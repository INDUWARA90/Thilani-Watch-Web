const mongoose = require('mongoose')

// Creates a 404 error for any request that reaches this middleware.
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

// Sends one consistent JSON error response for controller and routing errors.
const errorHandler = (error, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = error.message || 'Server error'

  // Mongoose throws CastError when a route receives an invalid MongoDB id.
  if (error instanceof mongoose.Error.CastError) {
    statusCode = 400
    message = 'Invalid resource id'
  }

  // Convert schema validation errors into a readable API response.
  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400
    message = Object.values(error.errors)
      .map((validationError) => validationError.message)
      .join(', ')
  }

  res.status(statusCode).json({
    message,
    // Hide stack traces in production so internal details are not exposed.
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  })
}

module.exports = {
  errorHandler,
  notFound,
}
