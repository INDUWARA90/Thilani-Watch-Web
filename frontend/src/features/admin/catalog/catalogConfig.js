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

export const catalogSections = [
  {
    api: {
      list: adminApi.getCategories,
      create: adminApi.createCategory,
      update: adminApi.updateCategory,
      remove: adminApi.deleteCategory,
    },
    label: 'Category',
    plural: 'Categories',
  },
  {
    api: {
      list: adminApi.getBrands,
      create: adminApi.createBrand,
      update: adminApi.updateBrand,
      remove: adminApi.deleteBrand,
    },
    label: 'Brand',
    plural: 'Brands',
  },
]
