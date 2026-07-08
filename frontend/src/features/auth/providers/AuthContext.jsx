import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiClient, getApiErrorMessage, setAuthToken } from '@/shared/api/apiClient'
import { authApi } from '@/features/auth/api/authApi'
import { AuthContext } from './authContextValue'
import { clearStoredAuth, loadStoredAuth, saveStoredAuth } from '@/features/auth/lib/authStorage'

export const AuthProvider = ({ children }) => {
  const [initialAuth] = useState(() => loadStoredAuth())
  const [token, setToken] = useState(initialAuth.token)
  const [user, setUser] = useState(initialAuth.user)
  const [isRestoring, setIsRestoring] = useState(true)

  const applyAuth = useCallback((nextAuth) => {
    setToken(nextAuth.token)
    setUser(nextAuth.user)
    setAuthToken(nextAuth.token)
    saveStoredAuth(nextAuth)
  }, [])

  const clearAuth = useCallback(() => {
    setToken('')
    setUser(null)
    setAuthToken('')
    clearStoredAuth()
  }, [])

  useEffect(() => {
    let isMounted = true
    const storedToken = initialAuth.token

    setAuthToken(storedToken)

    const restoreUser = async () => {
      try {
        const currentUser = await authApi.getCurrentUser()

        if (isMounted) {
          const nextAuth = { token: storedToken, user: currentUser }
          setToken(nextAuth.token)
          setUser(nextAuth.user)
          saveStoredAuth(nextAuth)
        }
      } catch (error) {
        if (isMounted && error?.response?.status === 401) {
          clearAuth()
        }
      } finally {
        if (isMounted) {
          setIsRestoring(false)
        }
      }
    }

    restoreUser()

    return () => {
      isMounted = false
    }
  }, [clearAuth, initialAuth.token])

  useEffect(() => {
    const interceptorId = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          clearAuth()
        }

        return Promise.reject(error)
      },
    )

    return () => {
      apiClient.interceptors.response.eject(interceptorId)
    }
  }, [clearAuth])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      isRestoring,
      async register(payload) {
        const auth = await authApi.register(payload)
        applyAuth(auth)
        return auth
      },
      async login(payload) {
        const auth = await authApi.login(payload)
        applyAuth(auth)
        return auth
      },
      async logout() {
        try {
          await authApi.logout()
        } catch (error) {
          if (error?.response?.status && error.response.status !== 401) {
            throw new Error(getApiErrorMessage(error, 'Logout failed.'), { cause: error })
          }
        } finally {
          clearAuth()
        }
      },
      async updateProfile(payload) {
        const nextUser = await authApi.updateProfile(payload)
        const nextAuth = { token, user: nextUser }
        setUser(nextUser)
        saveStoredAuth(nextAuth)
        return nextUser
      },
      async changePassword(payload) {
        return authApi.changePassword(payload)
      },
      clearAuth,
    }),
    [applyAuth, clearAuth, isRestoring, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
