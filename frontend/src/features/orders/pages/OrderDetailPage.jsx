import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { LoadingState } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
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
} from '@/features/orders/lib/orderUtils'
import { ordersApi } from '@/features/orders/api/ordersApi'

export const OrderDetailPage = () => {
  const { id } = useParams()
  usePageTitle('Order Details | Thilani Watch Web')

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [returnForm, setReturnForm] = useState({ notes: '', reason: '' })
  const queryClient = useQueryClient()

  const orderQuery = useQuery({
    queryFn: async () => normalizeOrder(await ordersApi.getOrder(id)),
    queryKey: ['orders', 'detail', id],
  })
  const order = orderQuery.data

  const handleCancel = async () => {
    setError('')
    setMessage('')
    try {
      await ordersApi.cancelOrder(getOrderId(order))
      setMessage('Order cancelled.')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['orders', 'detail', id] }),
        queryClient.invalidateQueries({ queryKey: ['orders', 'mine'] }),
      ])
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to cancel order.'))
    }
  }

  const handleReturnRequest = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    try {
      await ordersApi.requestReturn(getOrderId(order), {
        notes: returnForm.notes.trim(),
        reason: returnForm.reason.trim(),
      })
      setReturnForm({ notes: '', reason: '' })
      setMessage('Return request submitted.')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['orders', 'detail', id] }),
        queryClient.invalidateQueries({ queryKey: ['orders', 'mine'] }),
      ])
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to request return.'))
    }
  }

  if (orderQuery.isLoading) {
    return <LoadingState label="Loading order details" variant="form" />
  }

  return (
    <main>
      <Link className="mb-5 inline-flex min-h-11 items-center rounded-[14px] border border-[#DEE2E6] bg-[rgba(18,18,18,0.04)] px-8 text-sm font-normal text-[#121212] no-underline hover:bg-[rgba(18,18,18,0.08)]" to="/orders">
        Back to orders
      </Link>

      {(error || orderQuery.error) && <div className="mb-5 border border-[#DC3545] bg-red-50 px-4 py-3 font-normal text-[#DC3545]">{error || getApiErrorMessage(orderQuery.error, 'Unable to load order.')}</div>}
      {message && <div className="mb-5 border border-[#198754] bg-green-50 px-4 py-3 font-normal text-[#198754]">{message}</div>}

      {order && (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid gap-5">
            <div className="rounded-[20px] border border-[#DEE2E6] bg-white p-5 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)]">
              <p className="mb-2 text-sm font-normal text-[#F49006]">Order detail</p>
              <h1 className="mb-3 text-3xl font-bold leading-tight text-[#121212]">{order.orderNumber || getOrderId(order)}</h1>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={getOrderStatus(order)} />
                <StatusPill label={`Payment: ${getPaymentStatus(order)}`} />
              </div>
              <p className="mt-3 text-[#212529]">Created {formatDate(order.createdAt)}</p>
              {canCancelOrder(order) && (
                <button className="mt-4 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[14px] border border-[#DC3545] bg-red-50 px-4 text-sm font-normal text-[#DC3545] hover:bg-red-100" type="button" onClick={handleCancel}>
                  Cancel order
                </button>
              )}
            </div>

            <OrderItemsTable order={order} />
            <AddressCard address={order.shippingAddress} title="Shipping Address" />
            {order.billingAddress && <AddressCard address={order.billingAddress} title="Billing Address" />}
            {canRequestReturn(order) && (
              <form className="rounded-[20px] border border-[#DEE2E6] bg-white p-5" onSubmit={handleReturnRequest}>
                <h2 className="mb-4 text-xl font-bold text-[#121212]">Request a return</h2>
                <label className="mb-3 grid gap-2 text-base font-normal text-[#121212]">
                  Reason
                  <input className={inputClass} required value={returnForm.reason} onChange={(event) => setReturnForm((current) => ({ ...current, reason: event.target.value }))} />
                </label>
                <label className="mb-3 grid gap-2 text-base font-normal text-[#121212]">
                  Notes
                  <textarea className={`${inputClass} min-h-24 py-3`} value={returnForm.notes} onChange={(event) => setReturnForm((current) => ({ ...current, notes: event.target.value }))} />
                </label>
                <button className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[14px] bg-[#121212] px-5 text-sm font-normal text-white hover:bg-[#272222]" type="submit">
                  Submit return request
                </button>
              </form>
            )}
          </div>

          <aside className="h-fit rounded-[20px] border border-[#DEE2E6] bg-white p-5 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)]">
            <h2 className="mb-4 text-xl font-bold text-[#121212]">Summary</h2>
            <SummaryRow label="Subtotal" value={formatOrderMoney(getOrderSubtotal(order), order.currency)} />
            <SummaryRow label="Shipping" value={formatOrderMoney(order.shippingFee ?? SHIPPING_FEE, order.currency)} />
            <SummaryRow label="Discount" value={`-${formatOrderMoney(order.discountAmount || order.discount || 0, order.currency)}`} />
            <div className="my-4 border-t border-[#DEE2E6]" />
            <SummaryRow isStrong label="Total" value={formatOrderMoney(getOrderTotal(order), order.currency)} />
            <p className="mt-4 text-sm text-[#6C757D]">Payment method: {order.paymentMethod || 'Not set'}</p>
          </aside>
        </section>
      )}
    </main>
  )
}

const OrderItemsTable = ({ order }) => (
  <section className="rounded-[20px] border border-[#DEE2E6] bg-white p-5 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)]">
    <h2 className="mb-4 text-xl font-bold text-[#121212]">Items</h2>
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr>
            <th className="border-b border-[#DEE2E6] p-3 text-left align-top text-sm font-normal text-[#6C757D]">Item</th>
            <th className="border-b border-[#DEE2E6] p-3 text-left align-top text-sm font-normal text-[#6C757D]">Qty</th>
            <th className="border-b border-[#DEE2E6] p-3 text-left align-top text-sm font-normal text-[#6C757D]">Price</th>
          </tr>
        </thead>
        <tbody>
          {(order.items || []).map((item, index) => (
            <tr key={`${getOrderItemName(item)}-${index}`}>
              <td className="border-b border-[#DEE2E6] p-3 text-left align-top">{getOrderItemName(item)}</td>
              <td className="border-b border-[#DEE2E6] p-3 text-left align-top">{item.quantity}</td>
              <td className="border-b border-[#DEE2E6] p-3 text-left align-top">{formatOrderMoney(getOrderItemPrice(item), order.currency)}</td>
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
    <section className="rounded-[20px] border border-[#DEE2E6] bg-white p-5">
      <h2 className="mb-3 text-xl font-bold text-[#121212]">{title}</h2>
      <p className="text-[#212529]">{address.street}</p>
      <p className="text-[#212529]">{[address.city, address.state, address.zip].filter(Boolean).join(', ')}</p>
      <p className="text-[#212529]">{address.country}</p>
      <p className="text-[#212529]">{address.phone}</p>
    </section>
  )
}

const StatusPill = ({ label }) => (
  <span className="inline-flex w-fit rounded-full bg-green-100 px-2.5 py-1 text-xs font-extrabold text-green-800">{label}</span>
)

const inputClass = 'min-h-[45px] min-w-0 border border-[#DEE2E6] bg-white px-[15px] text-[#121212] outline-none focus:border-[#0D6EFD] focus:ring-2 focus:ring-[#0D6EFD]/25'

const canRequestReturn = (order) => getOrderStatus(order) === 'delivered' && !order.returnRequest && !order.returnStatus

const SummaryRow = ({ isStrong = false, label, value }) => (
  <div className="mb-3 flex items-center justify-between gap-3">
    <span className={`text-[#6C757D] ${isStrong ? 'text-lg font-bold' : 'font-normal'}`}>{label}</span>
    <strong className={isStrong ? 'text-xl text-[#121212]' : 'text-[#121212]'}>{value}</strong>
  </div>
)
