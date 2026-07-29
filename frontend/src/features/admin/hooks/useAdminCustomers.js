import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { getId, normalizeList } from '../lib/adminUtils'

export const useAdminCustomers = () => {
  const [customerOrders, setCustomerOrders] = useState([])
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState('')
  const [search, setSearch] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const queryClient = useQueryClient()
  const filters = useMemo(() => ({ search: submittedSearch }), [submittedSearch])
  const customersQuery = useQuery({
    queryKey: ['admin', 'customers', filters],
    queryFn: () => adminApi.getCustomers(filters),
    select: (payload) => normalizeList(payload, ['customers', 'users']),
  })
  const statusMutation = useMutation({
    mutationFn: ({ customerId, nextIsActive }) => adminApi.updateCustomerStatus(customerId, nextIsActive),
    onSuccess: async (_data, { customer, customerId, nextIsActive }) => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] })
      if (selectedCustomer && getId(selectedCustomer) === customerId) {
        await openCustomer({ ...customer, isActive: nextIsActive })
      }
    },
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, 'Unable to update customer status.'))
    },
    onSettled: () => setPendingId(''),
  })
  const customerDetailMutation = useMutation({
    mutationFn: async (customer) => {
      const customerId = getId(customer)
      const [detail, orders] = await Promise.all([
        adminApi.getCustomer(customerId),
        adminApi.getCustomerOrders(customerId),
      ])

      return { customer, detail, orders }
    },
    onSuccess: ({ customer, detail, orders }) => {
      setSelectedCustomer(detail?.customer || detail?.user || detail || customer)
      setCustomerOrders(normalizeList(orders, ['orders']))
    },
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, 'Unable to load customer details.'))
    },
    onSettled: () => setPendingId(''),
  })

  const handleSearch = (event) => {
    event.preventDefault()
    setSubmittedSearch(search.trim())
  }

  const openCustomer = async (customer) => {
    const customerId = getId(customer)
    setPendingId(customerId)
    setError('')
    await customerDetailMutation.mutateAsync(customer)
  }

  const toggleCustomerStatus = async (customer) => {
    const customerId = getId(customer)
    const nextIsActive = customer.isActive === false
    setPendingId(customerId)
    setError('')
    await statusMutation.mutateAsync({ customer, customerId, nextIsActive })
  }

  const loadError = customersQuery.error ? getApiErrorMessage(customersQuery.error, 'Unable to load customers.') : ''

  return {
    customerOrders,
    customers: customersQuery.data ?? [],
    error: error || loadError,
    handleSearch,
    isLoading: customersQuery.isLoading,
    openCustomer,
    pendingId,
    search,
    selectedCustomer,
    setSearch,
    toggleCustomerStatus,
  }
}
