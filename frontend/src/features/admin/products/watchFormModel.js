import { getId } from '../lib/adminUtils'

export const emptyWatchForm = {
  name: '',
  slug: '',
  brand: '',
  description: '',
  shortDescription: '',
  price: '',
  currency: 'LKR',
  images: '',
  imageUrlDraft: '',
  thumbnail: '',
  category: '',
  collection: '',
  movementType: '',
  caseMaterial: '',
  strapMaterial: '',
  strapSize: '',
  waterResistance: '',
  color: '',
  dialColor: '',
  dialSize: '',
  size: '',
  gender: 'gents',
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
  ['strapSize', 'Strap size'],
  ['waterResistance', 'Water resistance'],
  ['color', 'Color'],
  ['dialColor', 'Dial color'],
  ['dialSize', 'Dial size'],
  ['size', 'Size'],
  ['stockQuantity', 'Stock quantity', false, 'number'],
  ['thumbnail', 'Thumbnail URL'],
]

export const getImageUrl = (image) => {
  if (!image) return ''
  if (typeof image === 'string') return image
  return image.secure_url || image.secureUrl || image.url || image.path || image.src || ''
}

export const splitImageUrls = (images) =>
  String(images || '')
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)

export const mergeImageUrls = (currentImages, nextImages) => {
  const urls = splitImageUrls(currentImages)

  // Keep the same image URL only once.
  for (const image of nextImages) {
    const url = getImageUrl(image).trim()
    if (url && !urls.includes(url)) urls.push(url)
  }

  return urls.join('\n')
}

export const watchFromApi = (watch) => ({
  ...emptyWatchForm,
  ...watch,
  brand: getId(watch.brand),
  category: getId(watch.category),
  price: String(watch.price ?? ''),
  stockQuantity: String(watch.stockQuantity ?? 0),
  images: Array.isArray(watch.images) ? watch.images.map(getImageUrl).filter(Boolean).join('\n') : '',
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
  images: splitImageUrls(form.images),
  thumbnail: form.thumbnail.trim(),
  category: form.category,
  collection: form.collection.trim(),
  movementType: form.movementType.trim(),
  caseMaterial: form.caseMaterial.trim(),
  strapMaterial: form.strapMaterial.trim(),
  strapSize: form.strapSize.trim(),
  waterResistance: form.waterResistance.trim(),
  color: form.color.trim(),
  dialColor: form.dialColor.trim(),
  dialSize: form.dialSize.trim(),
  size: form.size.trim(),
  gender: form.gender.trim(),
  sku: form.sku.trim(),
  stockQuantity: Number.parseInt(form.stockQuantity || '0', 10),
  isFeatured: Boolean(form.isFeatured),
  isPublished: Boolean(form.isPublished),
})
