import { apiClient, unwrapApiData } from '@/shared/api/apiClient'

const buildParams = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined),
  )

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
