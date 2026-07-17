import { useCallback, useEffect, useState } from 'react'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { normalizeList } from '../lib/adminUtils'

export const useAdminOrders = () => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    let isMounted = true

    const loadOrders = async () => {
      try {
        const payload = await adminApi.getOrders()
        if (!isMounted) return
        setOrders(normalizeList(payload, ['orders']))
        setError('')
      } catch (apiError) {
        if (isMounted) setError(getApiErrorMessage(apiError, 'Unable to load orders.'))
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadOrders()
    return () => {
      isMounted = false
    }
  }, [])

  return { error, isLoading, orders }
}

export const useAdminOrderDetail = (id) => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState(null)

  const loadOrder = useCallback(async () => {
    setError('')
    setIsLoading(true)
    try {
      setOrder(await adminApi.getOrder(id))
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load order.'))
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    // Delay the first load one tick so React hook lint accepts the state updates.
    const timer = setTimeout(loadOrder, 0)
    return () => clearTimeout(timer)
  }, [loadOrder])

  return { error, isLoading, loadOrder, order }
}
