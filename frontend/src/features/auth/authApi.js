import { apiClient, unwrapApiData } from '../../lib/apiClient'

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

  async changePassword(payload) {
    return unwrapApiData(await apiClient.put('/auth/change-password', payload))
  },
}
