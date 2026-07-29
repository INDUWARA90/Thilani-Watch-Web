import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { getOrderId, normalizeOrder } from '@/features/orders/lib/orderUtils'
import { ordersApi } from '@/features/orders/api/ordersApi'

export const useOrderDetail = (id) => {
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [returnForm, setReturnForm] = useState({ notes: '', reason: '' })
  const queryClient = useQueryClient()
  const orderQuery = useQuery({
    enabled: Boolean(id),
    queryKey: ['orders', 'detail', id],
    queryFn: () => ordersApi.getOrder(id),
    select: normalizeOrder,
  })
  const invalidateOrder = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['orders', 'detail', id] }),
      queryClient.invalidateQueries({ queryKey: ['orders', 'mine'] }),
    ])
  }
  const cancelMutation = useMutation({
    mutationFn: ordersApi.cancelOrder,
    onSuccess: async () => {
      setMessage('Order cancelled successfully.')
      await invalidateOrder()
    },
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, 'Unable to cancel order.'))
    },
  })
  const returnMutation = useMutation({
    mutationFn: ({ orderId, payload }) => ordersApi.requestReturn(orderId, payload),
    onSuccess: async () => {
      setReturnForm({ notes: '', reason: '' })
      setMessage('Return request submitted successfully.')
      await invalidateOrder()
    },
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, 'Unable to request return.'))
    },
  })

  const order = orderQuery.data ?? null

  const cancelOrder = async () => {
    setError('')
    setMessage('')
    await cancelMutation.mutateAsync(getOrderId(order))
  }

  const requestReturn = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    await returnMutation.mutateAsync({
      orderId: getOrderId(order),
      payload: {
        notes: returnForm.notes.trim(),
        reason: returnForm.reason.trim(),
      },
    })
  }

  const updateReturnField = (name, value) => {
    setReturnForm((current) => ({ ...current, [name]: value }))
  }

  return {
    cancelOrder,
    error: error || (orderQuery.error ? getApiErrorMessage(orderQuery.error, 'Unable to load order.') : ''),
    isLoading: orderQuery.isLoading,
    message,
    order,
    requestReturn,
    returnForm,
    updateReturnField,
  }
}
