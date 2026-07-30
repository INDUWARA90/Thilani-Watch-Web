import { adminApi } from '../api/adminApi'

export const emptyCatalogForm = {
  name: '',
  slug: '',
  description: '',
  imageUrl: '',
  isActive: true,
  sortOrder: '0',
}

export const buildCatalogPayload = (form) => ({
  name: form.name.trim(),
  slug: form.slug.trim(),
  description: form.description.trim(),
  imageUrl: form.imageUrl.trim(),
  isActive: Boolean(form.isActive),
  sortOrder: Number.parseInt(form.sortOrder || '0', 10),
})

export const categoryCatalogSection = {
  api: {
    list: adminApi.getCategories,
    create: adminApi.createCategory,
    update: adminApi.updateCategory,
    remove: adminApi.deleteCategory,
  },
  label: 'Category',
  plural: 'Categories',
}

export const brandCatalogSection = {
  api: {
    list: adminApi.getBrands,
    create: adminApi.createBrand,
    update: adminApi.updateBrand,
    remove: adminApi.deleteBrand,
  },
  label: 'Brand',
  plural: 'Brands',
}

export const catalogSections = [categoryCatalogSection, brandCatalogSection]
