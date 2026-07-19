import { apiClient, unwrapApiData } from '@/shared/api/apiClient'

export const contactApi = {
  async submitContact(payload) {
    return unwrapApiData(await apiClient.post('/contact', payload))
  },
}
