const mongoose = require('mongoose')

let connectionPromise

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing from environment variables')
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri, {
      maxPoolSize: Number.parseInt(process.env.MONGO_MAX_POOL_SIZE, 10) || 10,
      serverSelectionTimeoutMS: Number.parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS, 10) || 5000,
    })
  }

  try {
    await connectionPromise
    console.log('MongoDB connected')
    return mongoose.connection
  } catch (error) {
    connectionPromise = null
    throw error
  }
}

module.exports = connectDB
