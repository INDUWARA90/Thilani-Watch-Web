import { apiClient, unwrapApiData } from '@/shared/api/apiClient'

const buildParams = (params = {}) => {
  const cleanParams = {}

  // Keep URLs clean by removing blank filter fields.
  for (const key in params) {
    const value = params[key]
    if (value !== '' && value !== null && value !== undefined) {
      cleanParams[key] = value
    }
  }

  return cleanParams
}

export const storefrontApi = {
  async getFeaturedWatches() {
    return unwrapApiData(await apiClient.get('/watches/featured'))
  },

  async getNewArrivals() {
    return unwrapApiData(await apiClient.get('/watches/new-arrivals'))
  },

  async getBestSellers() {
    return unwrapApiData(await apiClient.get('/watches/best-sellers'))
  },

  async getWatches(params) {
    return unwrapApiData(await apiClient.get('/watches', { params: buildParams(params) }))
  },

  async getWatchBySlug(slug) {
    return unwrapApiData(await apiClient.get(`/watches/slug/${slug}`))
  },

  async getWatchById(id) {
    return unwrapApiData(await apiClient.get(`/watches/${id}`))
  },

  async getCategories() {
    return unwrapApiData(await apiClient.get('/categories'))
  },

  async getBrands() {
    return unwrapApiData(await apiClient.get('/brands'))
  },
}
