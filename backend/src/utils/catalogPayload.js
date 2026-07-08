const normalizeBoolean = (value, defaultValue = true) => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value !== 'false'
  return defaultValue
}

const buildCatalogPayload = (body) => ({
  name: body.name?.trim(),
  slug: body.slug?.trim(),
  description: body.description?.trim() || '',
  imageUrl: body.imageUrl?.trim() || '',
  isActive: normalizeBoolean(body.isActive),
  sortOrder: Number.parseInt(body.sortOrder || '0', 10),
})

module.exports = { buildCatalogPayload }
