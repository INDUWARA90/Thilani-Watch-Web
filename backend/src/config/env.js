// these are the valid .Env Variables 
const REQUIRED_ENV_VARS = [
  'MONGO_URI',
  'CLIENT_URL',
  'JWT_SECRET',
  'RESEND_API_KEY',
  'SHOP_OWNER_EMAIL',
]
const VALID_NODE_ENVS = new Set(['development', 'production', 'test'])

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
