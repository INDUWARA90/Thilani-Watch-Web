import { getId } from '../adminUtils'

export const emptyWatchForm = {
  name: '',
  slug: '',
  brand: '',
  description: '',
  shortDescription: '',
  price: '',
  currency: 'LKR',
  images: '',
  thumbnail: '',
  category: '',
  collection: '',
  movementType: '',
  caseMaterial: '',
  strapMaterial: '',
  waterResistance: '',
  color: '',
  dialColor: '',
  size: '',
  sku: '',
  stockQuantity: '0',
  isFeatured: false,
  isPublished: true,
}

export const watchTextFields = [
  ['name', 'Name', true],
  ['slug', 'Slug', true],
  ['sku', 'SKU', true],
  ['price', 'Price', true, 'number'],
  ['currency', 'Currency'],
  ['collection', 'Collection'],
  ['movementType', 'Movement type'],
  ['caseMaterial', 'Case material'],
  ['strapMaterial', 'Strap material'],
  ['waterResistance', 'Water resistance'],
  ['color', 'Color'],
  ['dialColor', 'Dial color'],
  ['size', 'Size'],
  ['stockQuantity', 'Stock quantity', false, 'number'],
  ['thumbnail', 'Thumbnail URL'],
]

export const watchFromApi = (watch) => ({
  ...emptyWatchForm,
  ...watch,
  brand: getId(watch.brand),
  category: getId(watch.category),
  price: String(watch.price ?? ''),
  stockQuantity: String(watch.stockQuantity ?? 0),
  images: Array.isArray(watch.images) ? watch.images.join('\n') : '',
  isFeatured: Boolean(watch.isFeatured),
  isPublished: watch.isPublished !== false,
})

export const buildWatchPayload = (form) => ({
  name: form.name.trim(),
  slug: form.slug.trim(),
  brand: form.brand,
  description: form.description.trim(),
  shortDescription: form.shortDescription.trim(),
  price: Number(form.price),
  currency: form.currency.trim() || 'LKR',
  images: form.images
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean),
  thumbnail: form.thumbnail.trim(),
  category: form.category,
  collection: form.collection.trim(),
  movementType: form.movementType.trim(),
  caseMaterial: form.caseMaterial.trim(),
  strapMaterial: form.strapMaterial.trim(),
  waterResistance: form.waterResistance.trim(),
  color: form.color.trim(),
  dialColor: form.dialColor.trim(),
  size: form.size.trim(),
  sku: form.sku.trim(),
  stockQuantity: Number.parseInt(form.stockQuantity || '0', 10),
  isFeatured: Boolean(form.isFeatured),
  isPublished: Boolean(form.isPublished),
})
