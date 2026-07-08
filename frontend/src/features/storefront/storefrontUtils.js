export const getId = (value) => value?._id || value?.id || value || ''

export const getTitle = (value, fallback = 'Not set') => {
  if (!value) return fallback
  if (typeof value === 'string') return value
  return value.name || value.title || value.slug || value._id || fallback
}

export const getCatalogValue = (value) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value._id || value.id || value.slug || value.name || ''
}

export const getCatalogImage = (value) => {
  if (!value || typeof value === 'string') return ''
  return value.imageUrl || value.image || value.thumbnail || ''
}

export const formatMoney = (amount, currency = 'LKR') =>
  `${currency || 'LKR'} ${Number(amount || 0).toLocaleString()}`

export const getWatchImage = (watch) => {
  const image = watch?.thumbnail || watch?.images?.[0]

  if (typeof image === 'string') return image
  return image?.url || image?.secureUrl || image?.src || ''
}

export const normalizeList = (payload, keys = []) => {
  if (Array.isArray(payload)) return payload

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key]
  }

  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.results)) return payload.results
  return []
}

export const normalizeWatchPayload = (payload) => {
  if (payload?.watch) return payload.watch
  if (payload?.product) return payload.product
  return payload
}

export const normalizePagination = (payload) => ({
  page: Number(payload?.pagination?.page || payload?.page || 1),
  limit: Number(payload?.pagination?.limit || payload?.limit || 12),
  total: Number(payload?.pagination?.total || payload?.total || 0),
  pages: Number(payload?.pagination?.pages || payload?.pages || 1),
  hasNextPage: Boolean(payload?.pagination?.hasNextPage),
  hasPrevPage: Boolean(payload?.pagination?.hasPrevPage),
})
