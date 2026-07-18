const dotenv = require('dotenv')

dotenv.config()

const connectDB = require('./src/config/db')
const { validateEnv } = require('./src/config/env')
const app = require('./src/app')

validateEnv()

let databaseConnection

async function ensureDatabaseConnection() {
  if (!databaseConnection) {
    databaseConnection = connectDB()
  }

  return databaseConnection
}

app.use(async (req, res, next) => {
  try {
    await ensureDatabaseConnection()
    next()
  } catch (error) {
    next(error)
  }
})

module.exports = app

// Run a normal server only on your local computer
if (require.main === module) {
  const port = process.env.PORT || 5000

  ensureDatabaseConnection()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server running on port ${port}`)
      })
    })
    .catch((error) => {
      console.error(`Server failed to start: ${error.message}`)
      process.exit(1)
    })
}