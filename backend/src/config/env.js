// these are the valid .Env Variables 
const REQUIRED_ENV_VARS = ['MONGO_URI', 'CLIENT_URL', 'JWT_SECRET']
const VALID_NODE_ENVS = new Set(['development', 'production', 'test'])
const CLOUDINARY_ENV_VARS = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
]

// helping method that check is blank
const isBlank = (value) => !value || !value.trim()

// check .env variables is missing or not and LOG that 
const validateEnv = () => {

  const missing = REQUIRED_ENV_VARS.filter((name) => isBlank(process.env[name]))

  if (missing.length > 0) {
    console.log(`Missing .env variables: ${missing.join(', ')}`)
  }
}

module.exports = {
  validateEnv,
}
