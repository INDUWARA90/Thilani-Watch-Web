const DEFAULT_TTL_MS = 60 * 1000
const cache = new Map()

const buildCacheKey = (req) => `${req.method}:${req.originalUrl}`

const publicCache = (ttlMs = DEFAULT_TTL_MS) => (req, res, next) => {
  if (req.method !== 'GET') return next()

  const key = buildCacheKey(req)
  const cached = cache.get(key)

  if (cached && cached.expiresAt > Date.now()) {
    res.set('X-Cache', 'HIT')
    return res.status(cached.statusCode).json(cached.body)
  }

  if (cached) cache.delete(key)

  const originalJson = res.json.bind(res)
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(key, {
        body,
        expiresAt: Date.now() + ttlMs,
        statusCode: res.statusCode,
      })
    }

    res.set('X-Cache', 'MISS')
    return originalJson(body)
  }

  return next()
}

const clearPublicCache = () => {
  cache.clear()
}

module.exports = {
  clearPublicCache,
  publicCache,
}
