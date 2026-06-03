const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const connectDB = require('./src/config/db')
const watchRoutes = require('./src/routes/watchRoutes')

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  }),
)
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Thilani Watch API is running',
    status: 'ok',
  })
})

app.use('/api/watches', watchRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

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
