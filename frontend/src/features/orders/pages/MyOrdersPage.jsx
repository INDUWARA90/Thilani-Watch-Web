import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { LoadingState } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { canCancelOrder, formatDate, formatOrderMoney, getOrderId, getOrderStatus, getOrderTotal, getPaymentStatus, normalizeOrders } from '@/features/orders/lib/orderUtils'
import { ordersApi } from '@/features/orders/api/ordersApi'

export const MyOrdersPage = () => {
  usePageTitle('My Orders | Thilani Watch Web')

  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        const payload = await ordersApi.getMyOrders()
        if (isMounted) {
          setOrders(normalizeOrders(payload))
          setError('')
        }
      } catch (apiError) {
        if (isMounted) {
          setError(getApiErrorMessage(apiError, 'Unable to load your orders.'))
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
    <main>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-extrabold uppercase tracking-normal text-teal-700">Account</p>
          <h1 className="text-4xl font-bold leading-tight text-slate-950">My Orders</h1>
        </div>
        <Link className="font-bold text-teal-700 no-underline hover:underline" to="/watches">
          Continue shopping
        </Link>
      </div>

      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}
      {isLoading ? (
        <LoadingState label="Loading your orders" variant="reviews" rows={4} />
      ) : orders.length === 0 ? (
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-2 text-2xl font-bold text-slate-950">No orders yet</h2>
          <p className="mb-5 text-slate-600">Your completed checkouts will appear here.</p>
          <Link className="inline-flex min-h-11 w-fit items-center justify-center rounded-lg bg-teal-700 px-4 font-extrabold text-white no-underline hover:bg-teal-800" to="/watches">
            Browse watches
          </Link>
        </section>
      ) : (
        <div className="grid gap-3">
          {orders.map((order) => (
            <article className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_auto]" key={getOrderId(order)}>
              <div>
                <h2 className="mb-2 text-xl font-bold text-slate-950">{order.orderNumber || getOrderId(order)}</h2>
                <div className="flex flex-wrap gap-2">
                  <StatusPill label={getOrderStatus(order)} />
                  <StatusPill label={`Payment: ${getPaymentStatus(order)}`} />
                  {canCancelOrder(order) && <StatusPill label="Cancelable" tone="amber" />}
                </div>
                <p className="mt-3 text-sm text-slate-600">Created {formatDate(order.createdAt)}</p>
              </div>
              <div className="grid content-start gap-3 sm:text-right">
                <strong className="text-xl text-slate-950">{formatOrderMoney(getOrderTotal(order), order.currency)}</strong>
                <Link className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 font-extrabold text-slate-950 no-underline hover:bg-slate-50" to={`/orders/${getOrderId(order)}`}>
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

const StatusPill = ({ label, tone = 'green' }) => (
  <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-extrabold ${tone === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
    {label}
  </span>
)
