const cache = new Map()

const DEFAULT_TTL = 5 * 60 * 1000

export const cachedRequest = async (key, request, ttl = DEFAULT_TTL) => {
  const now = Date.now()
  const cached = cache.get(key)

  if (cached && cached.expiresAt > now) {
    return cached.promise
  }

  const promise = Promise.resolve(request()).catch((error) => {
    cache.delete(key)
    throw error
  })

  cache.set(key, {
    expiresAt: now + ttl,
    promise,
  })

  return promise
}
