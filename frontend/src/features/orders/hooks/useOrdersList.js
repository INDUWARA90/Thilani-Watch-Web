import { useEffect, useState } from 'react'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { normalizeOrders } from '@/features/orders/lib/orderUtils'
import { ordersApi } from '@/features/orders/api/ordersApi'

export const useOrdersList = () => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    let isActive = true

    const loadOrders = async () => {
      setIsLoading(true)
      setError('')
      try {
        const payload = await ordersApi.getMyOrders()
        if (isActive) setOrders(normalizeOrders(payload))
      } catch (apiError) {
        if (isActive) setError(getApiErrorMessage(apiError, 'Unable to load your orders.'))
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    loadOrders()
    return () => {
      isActive = false
    }
  }, [])

  return { error, isLoading, orders }
}

