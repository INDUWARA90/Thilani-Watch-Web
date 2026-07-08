import { apiClient, unwrapApiData } from '@/shared/api/apiClient'

const unwrapList = (response, keys) => {
  const data = unwrapApiData(response)

  if (Array.isArray(data)) {
    return data
  }

  for (const key of keys) {
    if (Array.isArray(data?.[key])) {
      return data[key]
    }
  }

  return []
}

const buildParams = (filters) =>
  Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '' && value !== null))

export const adminApi = {
  async getWatches(filters) {
    return unwrapApiData(await apiClient.get('/watches', { params: buildParams(filters) }))
  },

  async createWatch(payload) {
    return unwrapApiData(await apiClient.post('/watches', payload))
  },

  async updateWatch(id, payload) {
    return unwrapApiData(await apiClient.put(`/watches/${id}`, payload))
  },

  async updateWatchStock(id, stockQuantity) {
    return unwrapApiData(await apiClient.patch(`/watches/${id}/stock`, { stockQuantity }))
  },

  async updateWatchPublishStatus(id, isPublished) {
    return unwrapApiData(await apiClient.patch(`/watches/${id}/publish`, { isPublished }))
  },

  async deleteWatch(id) {
    return unwrapApiData(await apiClient.delete(`/watches/${id}`))
  },

  async getCategories() {
    return unwrapList(await apiClient.get('/categories'), ['categories'])
  },

  async createCategory(payload) {
    return unwrapApiData(await apiClient.post('/categories', payload))
  },

  async updateCategory(id, payload) {
    return unwrapApiData(await apiClient.put(`/categories/${id}`, payload))
  },

  async deleteCategory(id) {
    return unwrapApiData(await apiClient.delete(`/categories/${id}`))
  },

  async getBrands() {
    return unwrapList(await apiClient.get('/brands'), ['brands'])
  },

  async createBrand(payload) {
    return unwrapApiData(await apiClient.post('/brands', payload))
  },

  async updateBrand(id, payload) {
    return unwrapApiData(await apiClient.put(`/brands/${id}`, payload))
  },

  async deleteBrand(id) {
    return unwrapApiData(await apiClient.delete(`/brands/${id}`))
  },

  async getOrders() {
    return unwrapList(await apiClient.get('/orders'), ['orders'])
  },

  async getOrder(id) {
    return unwrapApiData(await apiClient.get(`/orders/${id}`))
  },

  async updateOrderStatus(id, orderStatus) {
    return unwrapApiData(await apiClient.patch(`/orders/${id}/status`, { orderStatus }))
  },

  async updatePaymentStatus(id, paymentStatus) {
    return unwrapApiData(await apiClient.patch(`/orders/${id}/payment-status`, { paymentStatus }))
  },

  async getReviews() {
    return unwrapList(await apiClient.get('/reviews'), ['reviews'])
  },

  async toggleReviewApproval(id) {
    return unwrapApiData(await apiClient.patch(`/reviews/${id}/approve`))
  },
}
