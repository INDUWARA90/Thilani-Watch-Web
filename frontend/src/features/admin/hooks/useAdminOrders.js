import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { normalizeList } from '../lib/adminUtils'

export const useAdminOrders = () => {
  const query = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: adminApi.getOrders,
    select: (payload) => normalizeList(payload, ['orders']),
  })

  return {
    error: query.error ? getApiErrorMessage(query.error, 'Unable to load orders.') : '',
    isLoading: query.isLoading,
    orders: query.data ?? [],
  }
}

export const useAdminOrderDetail = (id) => {
  const query = useQuery({
    enabled: Boolean(id),
    queryKey: ['admin', 'order', id],
    queryFn: () => adminApi.getOrder(id),
  })
  const loadOrder = useCallback(async () => {
    await query.refetch()
  }, [query])

  return {
    error: query.error ? getApiErrorMessage(query.error, 'Unable to load order.') : '',
    isLoading: query.isLoading,
    loadOrder,
    order: query.data ?? null,
  }
}
