import { apiClient, unwrapApiData } from '@/shared/api/apiClient'

export const ordersApi = {
  async createOrder(payload) {
    return unwrapApiData(await apiClient.post('/orders', payload))
  },

  async validateCoupon(payload) {
    return unwrapApiData(await apiClient.post('/coupons/validate', payload))
  },

  async getMyOrders() {
    return unwrapApiData(await apiClient.get('/orders/my-orders'))
  },

  async getOrder(id) {
    return unwrapApiData(await apiClient.get(`/orders/${id}`))
  },

  async cancelOrder(id) {
    return unwrapApiData(await apiClient.patch(`/orders/${id}/cancel`))
  },

  async refreshPaymentIntent(id) {
    return unwrapApiData(await apiClient.post(`/orders/${id}/payment-intent`))
  },

  async requestReturn(id, payload) {
    return unwrapApiData(await apiClient.post(`/orders/${id}/return`, payload))
  },
}
