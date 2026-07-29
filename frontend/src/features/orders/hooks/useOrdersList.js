import { useQuery } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { normalizeOrders } from '@/features/orders/lib/orderUtils'
import { ordersApi } from '@/features/orders/api/ordersApi'

export const useOrdersList = () => {
  const query = useQuery({
    queryKey: ['orders', 'mine'],
    queryFn: ordersApi.getMyOrders,
    select: normalizeOrders,
  })

  return {
    error: query.error ? getApiErrorMessage(query.error, 'Unable to load your orders.') : '',
    isLoading: query.isLoading,
    orders: query.data ?? [],
  }
}
