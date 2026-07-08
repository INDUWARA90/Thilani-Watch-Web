export const getId = (value) => value?._id || value?.id || value || ''

export const getTitle = (value, fallback = 'Untitled') => {
  if (!value) return fallback
  if (typeof value === 'string') return value
  return value.name || value.title || value.email || value._id || fallback
}

export const toSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const formatMoney = (amount, currency = 'LKR') =>
  `${currency || 'LKR'} ${Number(amount || 0).toLocaleString()}`

export const formatDate = (value) => {
  if (!value) return 'Not set'
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
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

export const readBoolean = (value) => value === true || value === 'true'
