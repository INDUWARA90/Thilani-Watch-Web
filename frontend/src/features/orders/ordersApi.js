import { apiClient, unwrapApiData } from '../../lib/apiClient'

export const ordersApi = {
  async createOrder(payload) {
    return unwrapApiData(await apiClient.post('/orders', payload))
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
}
