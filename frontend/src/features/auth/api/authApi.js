import { apiClient, unwrapApiData } from '@/shared/api/apiClient'

const normalizeAuthPayload = (response) => {
  const data = unwrapApiData(response)

  return {
    token: data?.token ?? '',
    user: data?.user ?? data ?? null,
  }
}

export const authApi = {
  async register(payload) {
    return normalizeAuthPayload(await apiClient.post('/auth/register', payload))
  },

  async login(payload) {
    return normalizeAuthPayload(await apiClient.post('/auth/login', payload))
  },

  async forgotPassword(payload) {
    const response = await apiClient.post('/auth/forgot-password', payload)
    return response.data?.message ?? 'If an account with that email exists, an OTP has been sent.'
  },

  async verifyOtp(payload) {
    return unwrapApiData(await apiClient.post('/auth/verify-otp', payload))
  },

  async resetPassword(payload) {
    const response = await apiClient.post('/auth/reset-password', payload)
    return response.data?.message ?? 'Password reset successfully'
  },

  async logout() {
    return apiClient.post('/auth/logout')
  },

  async getCurrentUser() {
    const data = unwrapApiData(await apiClient.get('/auth/me'))
    return data?.user ?? data ?? null
  },

  async updateProfile(payload) {
    const data = unwrapApiData(await apiClient.put('/auth/profile', payload))
    return data?.user ?? data ?? null
  },

  async getAddresses() {
    return unwrapApiData(await apiClient.get('/auth/addresses'))
  },

  async createAddress(payload) {
    return unwrapApiData(await apiClient.post('/auth/addresses', payload))
  },

  async updateAddress(addressId, payload) {
    return unwrapApiData(await apiClient.put(`/auth/addresses/${addressId}`, payload))
  },

  async deleteAddress(addressId) {
    return unwrapApiData(await apiClient.delete(`/auth/addresses/${addressId}`))
  },

  async setDefaultAddress(addressId) {
    return unwrapApiData(await apiClient.patch(`/auth/addresses/${addressId}/default`))
  },
}
