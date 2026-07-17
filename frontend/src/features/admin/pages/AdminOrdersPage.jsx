import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { LoadingState } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { getId, normalizeList } from '../lib/adminUtils'
import { OrderDetailSections } from '../orders/OrderDetailSections'
import { OrdersTable } from '../orders/OrdersTable'

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        const payload = await adminApi.getOrders()
        if (isMounted) {
          setOrders(normalizeList(payload, ['orders']))
          setError('')
        }
      } catch (apiError) {
        if (isMounted) {
          setError(getApiErrorMessage(apiError, 'Unable to load orders.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            Overview
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Customer Orders
          </h1>
        </div>
      </div>

      {/* Error Callout */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-sm font-medium text-rose-800 shadow-sm">
          {error}
        </div>
      )}

      {/* Content Area */}
      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <LoadingState label="Loading customer orders..." variant="table" rows={6} />
        </div>
      ) : (
        <OrdersTable orders={orders} />
      )}
    </div>
  )
}

export const AdminOrderDetailPage = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadOrder = async () => {
    setError('')
    setIsLoading(true)
    try {
      setOrder(await adminApi.getOrder(id))
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load order.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        const payload = await adminApi.getOrder(id)
        if (isMounted) {
          setOrder(payload)
          setError('')
        }
      } catch (apiError) {
        if (isMounted) {
          setError(getApiErrorMessage(apiError, 'Unable to load order.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <LoadingState label="Loading order profile..." variant="form" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Navigation Breadcrumb / Flow Control */}
      <div>
        <Link 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-teal-600 group" 
          to="/admin/orders"
        >
          <span className="transform transition-transform group-hover:-translate-x-0.5">←</span> 
          Back to Orders
        </Link>
      </div>

      {/* Error Callout */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-sm font-medium text-rose-800 shadow-sm">
          {error}
        </div>
      )}

      {/* Order Context & Header */}
      {order && (
        <>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
              Order Profile
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl font-mono">
              #{order.orderNumber || getId(order).slice(-8).toUpperCase()}
            </h1>
          </div>

          <OrderDetailSections order={order} onUpdated={loadOrder} />
        </>
      )}
    </div>
  )
}