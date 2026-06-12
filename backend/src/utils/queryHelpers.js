/**
 * Escapes special characters for RegExp search.
 */
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Converts truthy/falsy strings to actual booleans.
 */
const parseBoolean = (value) => {
  if (value === true || value === 'true') return true
  if (value === false || value === 'false') return false
  return undefined
}

/**
 * Common utility for parsing pagination parameters.
 * @param {Object} query - The request query object
 * @param {number} defaultLimit - Default items per page
 * @param {number} maxLimit - Maximum allowed items per page
 */
const getPaginationParams = (query, defaultLimit = 12, maxLimit = 100) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1)
  const limit = Math.min(
    Math.max(1, Number.parseInt(query.limit, 10) || defaultLimit),
    maxLimit
  )
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

/**
 * Standardizes API list responses with data and pagination metadata.
 */
const formatPaginatedResponse = (data, total, page, limit) => {
  const pages = Math.ceil(total / limit)
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNextPage: page < pages,
      hasPrevPage: page > 1,
    },
  }
}

module.exports = {
  escapeRegex,
  parseBoolean,
  getPaginationParams,
  formatPaginatedResponse,
}