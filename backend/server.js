const dotenv = require('dotenv')
const connectDB = require('./src/config/db')
const { validateEnv } = require('./src/config/env')

dotenv.config()
validateEnv()

const app = require('./src/app')

const port = process.env.PORT || 5000

// Connect to MongoDB 
const startServer = async () => {
  try {
    await connectDB()
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  } catch (error) {
    console.error(`Server failed to start: ${error.message}`)
    process.exit(1)
  }
}

startServer()
