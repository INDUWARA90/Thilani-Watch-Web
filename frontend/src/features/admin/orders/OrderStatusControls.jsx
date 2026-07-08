import { useState } from 'react'
import { getApiErrorMessage } from '../../../lib/apiClient'
import { adminApi } from '../adminApi'
import { getId } from '../adminUtils'
import { orderStatuses, paymentStatuses } from './orderStatusOptions'

export const OrderStatusControls = ({ order, onUpdated }) => {
  const [orderStatus, setOrderStatus] = useState(order.orderStatus || 'pending')
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus || 'pending')
  const [error, setError] = useState('')

  const updateOrderStatus = async () => {
    setError('')
    try {
      await adminApi.updateOrderStatus(getId(order), orderStatus)
      await onUpdated()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to update order status.'))
    }
  }

  const updatePaymentStatus = async () => {
    setError('')
    try {
      await adminApi.updatePaymentStatus(getId(order), paymentStatus)
      await onUpdated()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to update payment status.'))
    }
  }

  return (
    <div className="grid items-end gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}
      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Order status
        <select className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" value={orderStatus} onChange={(event) => setOrderStatus(event.target.value)}>
          {orderStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      <button className="inline-flex min-h-8 w-fit cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-extrabold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={updateOrderStatus}>
        Update order
      </button>
      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Payment status
        <select className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}>
          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      <button className="inline-flex min-h-8 w-fit cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-extrabold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={updatePaymentStatus}>
        Update payment
      </button>
    </div>
  )
}
