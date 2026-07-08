import { apiClient, unwrapApiData } from '@/shared/api/apiClient'

export const reviewsApi = {
  async getWatchReviews(watchId) {
    return unwrapApiData(await apiClient.get(`/watches/${watchId}/reviews`))
  },

  async createReview(watchId, payload) {
    return unwrapApiData(await apiClient.post(`/watches/${watchId}/reviews`, payload))
  },

  async updateReview(reviewId, payload) {
    return unwrapApiData(await apiClient.put(`/reviews/${reviewId}`, payload))
  },

  async deleteReview(reviewId) {
    return unwrapApiData(await apiClient.delete(`/reviews/${reviewId}`))
  },
}
