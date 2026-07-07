const AUTH_STORAGE_KEY = 'thilani_watch_auth'

export const loadStoredAuth = () => {
  try {
    const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return storedValue ? JSON.parse(storedValue) : { token: '', user: null }
  } catch {
    return { token: '', user: null }
  }
}

export const saveStoredAuth = ({ token, user }) => {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }))
}

export const clearStoredAuth = () => {
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}
