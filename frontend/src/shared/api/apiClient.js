import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete apiClient.defaults.headers.common.Authorization
}

export const getApiErrorMessage = (error, fallback = 'Something went wrong.') => {
  const data = error?.response?.data

  // Backend errors are not perfectly uniform yet, so read the common shapes in one place.
  if (typeof data?.message === 'string') {
    return data.message
  }

  if (typeof data?.error === 'string') {
    return data.error
  }

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors
      .map((item) => item?.message || item?.msg || item)
      .filter(Boolean)
      .join(', ')
  }

  if (data?.errors && typeof data.errors === 'object') {
    const messages = Object.entries(data.errors)
      .map(([field, value]) => {
        if (typeof value === 'string') return `${field}: ${value}`
        if (typeof value?.message === 'string') return `${field}: ${value.message}`
        return ''
      })
      .filter(Boolean)

    if (messages.length > 0) return messages.join(', ')
  }

  if (Array.isArray(data?.validationErrors) && data.validationErrors.length > 0) {
    return data.validationErrors
      .map((item) => item?.message || item?.msg || item)
      .filter(Boolean)
      .join(', ')
  }

  if (error?.response?.status === 403) {
    return 'You do not have permission to perform this action.'
  }

  if (typeof error?.message === 'string') {
    return error.message
  }

  return fallback
}

export const unwrapApiData = (response) => response.data?.data ?? response.data

export const isForbiddenError = (error) => error?.response?.status === 403
