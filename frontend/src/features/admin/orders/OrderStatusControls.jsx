import { useState } from 'react'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { getId } from '../lib/adminUtils'
import { orderStatuses, paymentStatuses } from './orderStatusOptions'

export const OrderStatusControls = ({ order, onUpdated }) => {
  const [orderStatus, setOrderStatus] = useState(order.orderStatus || 'pending')
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus || 'pending')
  const [shipping, setShipping] = useState({
    courierName: order.courierName || order.shipping?.courierName || '',
    estimatedDeliveryDate: toDateInputValue(order.estimatedDeliveryDate || order.shipping?.estimatedDeliveryDate),
    trackingNumber: order.trackingNumber || order.shipping?.trackingNumber || '',
  })
  const [transactionId, setTransactionId] = useState(order.transactionId || order.payment?.providerPaymentId || '')
  const [returnAction, setReturnAction] = useState({ notes: '', status: order.returnStatus || order.returnRequest?.status || 'approved' })
  const [refund, setRefund] = useState({ amount: order.totalAmount ?? order.total ?? '', reason: 'requested_by_customer' })
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

  const confirmPayment = async () => {
    setError('')
    try {
      await adminApi.confirmPayment(getId(order), transactionId.trim())
      await onUpdated()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to confirm payment.'))
    }
  }

  const updateShipping = async () => {
    setError('')
    try {
      await adminApi.updateShipping(getId(order), {
        courierName: shipping.courierName.trim(),
        estimatedDeliveryDate: shipping.estimatedDeliveryDate ? new Date(shipping.estimatedDeliveryDate).toISOString() : undefined,
        orderStatus: 'shipped',
        trackingNumber: shipping.trackingNumber.trim(),
      })
      await onUpdated()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to update shipping.'))
    }
  }

  const updateShippingField = (field, value) => {
    setShipping((current) => ({ ...current, [field]: value }))
  }

  const processReturn = async () => {
    setError('')
    try {
      await adminApi.processReturn(getId(order), {
        notes: returnAction.notes.trim(),
        status: returnAction.status,
      })
      await onUpdated()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to process return.'))
    }
  }

  const refundOrder = async () => {
    setError('')
    try {
      await adminApi.refundOrder(getId(order), {
        amount: Number(refund.amount || 0),
        reason: refund.reason.trim(),
      })
      await onUpdated()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to refund order.'))
    }
  }

  return (
    <div className="grid gap-4">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}
      <div className="grid items-end gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
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
      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Transaction ID
        <input className={controlClass} value={transactionId} onChange={(event) => setTransactionId(event.target.value)} />
      </label>
      <button className="inline-flex min-h-8 w-fit cursor-pointer items-center justify-center rounded-lg border border-emerald-300 bg-emerald-50 px-3 text-sm font-extrabold text-emerald-900 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-65 md:col-start-2" type="button" onClick={confirmPayment}>
        Confirm paid
      </button>
      </div>
      <div className="grid gap-3 border-t border-slate-200 pt-4">
        <h4 className="m-0 text-sm font-extrabold uppercase text-slate-600">Shipping</h4>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Tracking number
            <input className={controlClass} value={shipping.trackingNumber} onChange={(event) => updateShippingField('trackingNumber', event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Courier
            <input className={controlClass} value={shipping.courierName} onChange={(event) => updateShippingField('courierName', event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Estimated delivery
            <input className={controlClass} type="date" value={shipping.estimatedDeliveryDate} onChange={(event) => updateShippingField('estimatedDeliveryDate', event.target.value)} />
          </label>
        </div>
        <button className="inline-flex min-h-8 w-fit cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-extrabold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={updateShipping}>
          Update shipping
        </button>
      </div>
      <div className="grid gap-3 border-t border-slate-200 pt-4">
        <h4 className="m-0 text-sm font-extrabold uppercase text-slate-600">Returns and refunds</h4>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Return status
            <select className={controlClass} value={returnAction.status} onChange={(event) => setReturnAction((current) => ({ ...current, status: event.target.value }))}>
              {returnStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Return notes
            <input className={controlClass} value={returnAction.notes} onChange={(event) => setReturnAction((current) => ({ ...current, notes: event.target.value }))} />
          </label>
        </div>
        <button className="inline-flex min-h-8 w-fit cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-extrabold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={processReturn}>
          Process return
        </button>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Refund amount
            <input className={controlClass} type="number" value={refund.amount} onChange={(event) => setRefund((current) => ({ ...current, amount: event.target.value }))} />
          </label>
          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Refund reason
            <input className={controlClass} value={refund.reason} onChange={(event) => setRefund((current) => ({ ...current, reason: event.target.value }))} />
          </label>
        </div>
        <button className="inline-flex min-h-8 w-fit cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-extrabold text-red-900 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={refundOrder}>
          Refund order
        </button>
      </div>
    </div>
  )
}

const controlClass = 'min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15'
const returnStatuses = ['approved', 'rejected', 'received', 'refunded']

const toDateInputValue = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}
