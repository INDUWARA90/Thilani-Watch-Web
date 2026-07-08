import { apiClient, unwrapApiData } from '@/shared/api/apiClient'

export const commerceApi = {
  async getCart() {
    return unwrapApiData(await apiClient.get('/cart'))
  },

  async addCartItem(watchId, quantity = 1) {
    return unwrapApiData(await apiClient.post('/cart/items', { watchId, quantity }))
  },

  async updateCartItem(watchId, quantity) {
    return unwrapApiData(await apiClient.put(`/cart/items/${watchId}`, { quantity }))
  },

  async removeCartItem(watchId) {
    return unwrapApiData(await apiClient.delete(`/cart/items/${watchId}`))
  },

  async clearCart() {
    return unwrapApiData(await apiClient.delete('/cart'))
  },

  async getWishlist() {
    return unwrapApiData(await apiClient.get('/wishlist'))
  },

  async addWishlistItem(watchId) {
    return unwrapApiData(await apiClient.post(`/wishlist/${watchId}`))
  },

  async removeWishlistItem(watchId) {
    return unwrapApiData(await apiClient.delete(`/wishlist/${watchId}`))
  },
}
