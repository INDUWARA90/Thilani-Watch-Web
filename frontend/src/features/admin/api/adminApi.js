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

const buildParams = (filters = {}) => {
  const params = {}

  // Do not send empty filters to the backend.
  for (const key in filters) {
    const value = filters[key]
    if (value !== '' && value !== null && value !== undefined) {
      params[key] = value
    }
  }

  return params
}

export const adminApi = {
  async getWatches(filters) {
    return unwrapApiData(await apiClient.get('/watches/admin/all', { params: buildParams(filters) }))
  },

  async getLowStockWatches(threshold = 5) {
    return unwrapList(await apiClient.get('/watches/admin/low-stock', { params: { threshold } }), ['watches', 'products'])
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
    return unwrapList(await apiClient.get('/categories/admin/all'), ['categories'])
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

  async restoreCategory(id) {
    return unwrapApiData(await apiClient.patch(`/categories/${id}/restore`))
  },

  async getBrands() {
    return unwrapList(await apiClient.get('/brands/admin/all'), ['brands'])
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

  async restoreBrand(id) {
    return unwrapApiData(await apiClient.patch(`/brands/${id}/restore`))
  },

  async getOrders(filters) {
    return unwrapList(await apiClient.get('/orders', { params: buildParams(filters) }), ['orders'])
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

  async confirmPayment(id, transactionId) {
    return unwrapApiData(await apiClient.patch(`/orders/${id}/confirm-payment`, transactionId ? { transactionId } : {}))
  },

  async updateShipping(id, payload) {
    return unwrapApiData(await apiClient.patch(`/orders/${id}/shipping`, payload))
  },

  async processReturn(id, payload) {
    return unwrapApiData(await apiClient.patch(`/orders/${id}/return`, payload))
  },

  async refundOrder(id, payload) {
    return unwrapApiData(await apiClient.post(`/orders/${id}/refund`, payload))
  },

  async getReviews() {
    return unwrapList(await apiClient.get('/reviews/admin/all'), ['reviews'])
  },

  async toggleReviewApproval(id) {
    return unwrapApiData(await apiClient.patch(`/reviews/${id}/approve`))
  },

  async getContactMessages(filters) {
    return unwrapList(await apiClient.get('/contact', { params: buildParams(filters) }), ['messages', 'contacts', 'contactMessages'])
  },

  async getContactMessage(id) {
    return unwrapApiData(await apiClient.get(`/contact/${id}`))
  },

  async updateContactReadStatus(id, isRead) {
    return unwrapApiData(await apiClient.patch(`/contact/${id}`, { isRead }))
  },

  async deleteContactMessage(id) {
    return unwrapApiData(await apiClient.delete(`/contact/${id}`))
  },

  async getDashboardSummary() {
    return unwrapApiData(await apiClient.get('/admin/dashboard/summary'))
  },

  async getDashboardSales(days = 30) {
    return unwrapApiData(await apiClient.get('/admin/dashboard/sales', { params: { days } }))
  },

  async getCustomers(filters) {
    return unwrapList(await apiClient.get('/admin/customers', { params: buildParams(filters) }), ['customers', 'users'])
  },

  async getCustomer(id) {
    return unwrapApiData(await apiClient.get(`/admin/customers/${id}`))
  },

  async getCustomerOrders(id) {
    return unwrapList(await apiClient.get(`/admin/customers/${id}/orders`), ['orders'])
  },

  async updateCustomerStatus(id, isActive) {
    return unwrapApiData(await apiClient.patch(`/admin/customers/${id}/status`, { isActive }))
  },

  async getCoupons(filters) {
    return unwrapList(await apiClient.get('/coupons', { params: buildParams(filters) }), ['coupons'])
  },

  async createCoupon(payload) {
    return unwrapApiData(await apiClient.post('/coupons', payload))
  },

  async updateCoupon(id, payload) {
    return unwrapApiData(await apiClient.put(`/coupons/${id}`, payload))
  },

  async deleteCoupon(id) {
    return unwrapApiData(await apiClient.delete(`/coupons/${id}`))
  },
}
