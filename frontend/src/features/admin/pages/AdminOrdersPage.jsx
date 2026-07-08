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
    <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(28,41,56,0.06)] sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-teal-700">Orders</p>
          <h2 className="m-0 text-3xl font-bold leading-tight text-slate-950">Customer orders</h2>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}
      {isLoading ? <LoadingState label="Loading customer orders" variant="table" rows={6} /> : <OrdersTable orders={orders} />}
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

  if (isLoading) return <LoadingState label="Loading order details" variant="form" />

  return (
    <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(28,41,56,0.06)] sm:p-7">
      <Link className="font-bold text-teal-700 no-underline hover:underline" to="/admin/orders">
        Back to orders
      </Link>
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}
      {order && (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-teal-700">Order detail</p>
              <h2 className="m-0 text-3xl font-bold leading-tight text-slate-950">{order.orderNumber || getId(order)}</h2>
            </div>
          </div>
          <OrderDetailSections order={order} onUpdated={loadOrder} />
        </>
      )}
    </div>
  )
}
