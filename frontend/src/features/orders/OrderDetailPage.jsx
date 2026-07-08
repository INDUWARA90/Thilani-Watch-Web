import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getApiErrorMessage } from '../../lib/apiClient'
import { usePageTitle } from '../../lib/usePageTitle'
import {
  canCancelOrder,
  formatDate,
  formatOrderMoney,
  getOrderId,
  getOrderItemName,
  getOrderItemPrice,
  getOrderStatus,
  getOrderSubtotal,
  getOrderTotal,
  getPaymentStatus,
  normalizeOrder,
  SHIPPING_FEE,
} from './orderUtils'
import { ordersApi } from './ordersApi'

export const OrderDetailPage = () => {
  const { id } = useParams()
  usePageTitle('Order Details | Thilani Watch Web')

  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadOrder = async () => {
    setError('')
    setIsLoading(true)
    try {
      setOrder(normalizeOrder(await ordersApi.getOrder(id)))
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
        const payload = await ordersApi.getOrder(id)
        if (isMounted) {
          setOrder(normalizeOrder(payload))
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

  const handleCancel = async () => {
    setError('')
    setMessage('')
    try {
      await ordersApi.cancelOrder(getOrderId(order))
      setMessage('Order cancelled.')
      await loadOrder()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to cancel order.'))
    }
  }

  if (isLoading) {
    return <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 font-bold text-emerald-950">Loading order...</div>
  }

  return (
    <main>
      <Link className="mb-5 inline-block font-bold text-teal-700 no-underline hover:underline" to="/orders">
        Back to orders
      </Link>

      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}
      {message && <div className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 font-bold text-emerald-950">{message}</div>}

      {order && (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid gap-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <p className="mb-2 text-sm font-extrabold uppercase tracking-normal text-teal-700">Order detail</p>
              <h1 className="mb-3 text-3xl font-bold leading-tight text-slate-950">{order.orderNumber || getOrderId(order)}</h1>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={getOrderStatus(order)} />
                <StatusPill label={`Payment: ${getPaymentStatus(order)}`} />
              </div>
              <p className="mt-3 text-slate-600">Created {formatDate(order.createdAt)}</p>
              {canCancelOrder(order) && (
                <button className="mt-4 inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 font-extrabold text-red-800 hover:bg-red-100" type="button" onClick={handleCancel}>
                  Cancel order
                </button>
              )}
            </div>

            <OrderItemsTable order={order} />
            <AddressCard address={order.shippingAddress} title="Shipping Address" />
            {order.billingAddress && <AddressCard address={order.billingAddress} title="Billing Address" />}
          </div>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-xl font-bold text-slate-950">Summary</h2>
            <SummaryRow label="Subtotal" value={formatOrderMoney(getOrderSubtotal(order), order.currency)} />
            <SummaryRow label="Shipping" value={formatOrderMoney(order.shippingFee ?? SHIPPING_FEE, order.currency)} />
            <SummaryRow label="Discount" value={`-${formatOrderMoney(order.discountAmount || order.discount || 0, order.currency)}`} />
            <div className="my-4 border-t border-slate-200" />
            <SummaryRow isStrong label="Total" value={formatOrderMoney(getOrderTotal(order), order.currency)} />
            <p className="mt-4 text-sm text-slate-500">Payment method: {order.paymentMethod || 'Not set'}</p>
          </aside>
        </section>
      )}
    </main>
  )
}

const OrderItemsTable = ({ order }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5">
    <h2 className="mb-4 text-xl font-bold text-slate-950">Items</h2>
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr>
            <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Item</th>
            <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Qty</th>
            <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Price</th>
          </tr>
        </thead>
        <tbody>
          {(order.items || []).map((item, index) => (
            <tr key={`${getOrderItemName(item)}-${index}`}>
              <td className="border-b border-slate-200 p-3 text-left align-top">{getOrderItemName(item)}</td>
              <td className="border-b border-slate-200 p-3 text-left align-top">{item.quantity}</td>
              <td className="border-b border-slate-200 p-3 text-left align-top">{formatOrderMoney(getOrderItemPrice(item), order.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)

const AddressCard = ({ address, title }) => {
  if (!address) return null

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="mb-3 text-xl font-bold text-slate-950">{title}</h2>
      <p className="text-slate-700">{address.street}</p>
      <p className="text-slate-700">{[address.city, address.state, address.zip].filter(Boolean).join(', ')}</p>
      <p className="text-slate-700">{address.country}</p>
      <p className="text-slate-700">{address.phone}</p>
    </section>
  )
}

const StatusPill = ({ label }) => (
  <span className="inline-flex w-fit rounded-full bg-green-100 px-2.5 py-1 text-xs font-extrabold text-green-800">{label}</span>
)

const SummaryRow = ({ isStrong = false, label, value }) => (
  <div className="mb-3 flex items-center justify-between gap-3">
    <span className={`text-slate-600 ${isStrong ? 'text-lg font-extrabold' : 'font-bold'}`}>{label}</span>
    <strong className={isStrong ? 'text-xl text-slate-950' : 'text-slate-950'}>{value}</strong>
  </div>
)
