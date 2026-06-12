const ErrorResponse = require('../utils/ErrorResponse')

const notFound = (req, res, next) => {
  const error = new ErrorResponse(`Not Found - ${req.originalUrl}`, 404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log to console for dev
  if (process.env.NODE_ENV !== 'production') {
    console.error(err)
  }

  // Mongoose bad ObjectId (Invalid ID)
  if (err.name === 'CastError') {
    const message = 'Resource not found'
    error = new ErrorResponse(message, 404)
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = 'Validation failed'
    const errors = Object.keys(err.errors).map((key) => ({
      field: key,
      message: err.errors[key].message,
    }))
    error = new ErrorResponse(message, 400, errors)
  }

  // Mongoose duplicate key (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    const message = `Duplicate field value entered: ${field}`
    const errors = [{ field, message: `The ${field} already exists.` }]
    error = new ErrorResponse(message, 400, errors)
  }

  // Invalid JSON Body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = new ErrorResponse('Invalid JSON body', 400)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    errors: error.errors || [],
  })
}

module.exports = { notFound, errorHandler }