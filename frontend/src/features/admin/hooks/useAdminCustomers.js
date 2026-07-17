import { useEffect, useState } from 'react'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { getId, normalizeList } from '../lib/adminUtils'

export const useAdminCustomers = () => {
  const [customerOrders, setCustomerOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [pendingId, setPendingId] = useState('')
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const loadCustomers = async (filters = {}) => {
    setError('')
    setIsLoading(true)
    try {
      const payload = await adminApi.getCustomers(filters)
      setCustomers(normalizeList(payload, ['customers', 'users']))
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load customers.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Delay the first load one tick so React hook lint accepts the state updates.
    const timer = setTimeout(() => loadCustomers(), 0)
    return () => clearTimeout(timer)
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    loadCustomers({ search })
  }

  const openCustomer = async (customer) => {
    const customerId = getId(customer)
    setPendingId(customerId)
    setError('')
    try {
      const [detail, orders] = await Promise.all([
        adminApi.getCustomer(customerId),
        adminApi.getCustomerOrders(customerId),
      ])
      setSelectedCustomer(detail?.customer || detail?.user || detail || customer)
      setCustomerOrders(normalizeList(orders, ['orders']))
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load customer details.'))
    } finally {
      setPendingId('')
    }
  }

  const toggleCustomerStatus = async (customer) => {
    const customerId = getId(customer)
    const nextIsActive = customer.isActive === false
    setPendingId(customerId)
    setError('')
    try {
      await adminApi.updateCustomerStatus(customerId, nextIsActive)
      await loadCustomers({ search })
      if (selectedCustomer && getId(selectedCustomer) === customerId) {
        await openCustomer({ ...customer, isActive: nextIsActive })
      }
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to update customer status.'))
    } finally {
      setPendingId('')
    }
  }

  return {
    customerOrders,
    customers,
    error,
    handleSearch,
    isLoading,
    openCustomer,
    pendingId,
    search,
    selectedCustomer,
    setSearch,
    toggleCustomerStatus,
  }
}
