import { useCallback, useEffect, useState } from 'react'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { getOrderId, normalizeOrder } from '@/features/orders/lib/orderUtils'
import { ordersApi } from '@/features/orders/api/ordersApi'

export const useOrderDetail = (id) => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [order, setOrder] = useState(null)
  const [returnForm, setReturnForm] = useState({ notes: '', reason: '' })

  const loadOrder = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      setOrder(normalizeOrder(await ordersApi.getOrder(id)))
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

  const cancelOrder = async () => {
    setError('')
    setMessage('')
    try {
      await ordersApi.cancelOrder(getOrderId(order))
      setMessage('Order cancelled successfully.')
      await loadOrder()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to cancel order.'))
    }
  }

  const requestReturn = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    try {
      await ordersApi.requestReturn(getOrderId(order), {
        notes: returnForm.notes.trim(),
        reason: returnForm.reason.trim(),
      })
      setReturnForm({ notes: '', reason: '' })
      setMessage('Return request submitted successfully.')
      await loadOrder()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to request return.'))
    }
  }

  const updateReturnField = (name, value) => {
    setReturnForm((current) => ({ ...current, [name]: value }))
  }

  return {
    cancelOrder,
    error,
    isLoading,
    message,
    order,
    requestReturn,
    returnForm,
    updateReturnField,
  }
}
