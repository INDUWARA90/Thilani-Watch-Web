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
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (apiCall, fallbackMessage) => {
    setError('')
    setIsLoading(true)
    try {
      await apiCall()
      await onUpdated()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, fallbackMessage))
    } finally {
      setIsLoading(false)
    }
  }

  const updateOrderStatus = () => 
    handleAction(() => adminApi.updateOrderStatus(getId(order), orderStatus), 'Unable to update order status.')

  const updatePaymentStatus = () => 
    handleAction(() => adminApi.updatePaymentStatus(getId(order), paymentStatus), 'Unable to update payment status.')

  const confirmPayment = () => 
    handleAction(() => adminApi.confirmPayment(getId(order), transactionId.trim()), 'Unable to confirm payment.')

  const updateShipping = () => 
    handleAction(() => adminApi.updateShipping(getId(order), {
      courierName: shipping.courierName.trim(),
      estimatedDeliveryDate: shipping.estimatedDeliveryDate ? new Date(shipping.estimatedDeliveryDate).toISOString() : undefined,
      orderStatus: 'shipped',
      trackingNumber: shipping.trackingNumber.trim(),
    }), 'Unable to update shipping.')

  const updateShippingField = (field, value) => {
    setShipping((current) => ({ ...current, [field]: value }))
  }

  const processReturn = () => 
    handleAction(() => adminApi.processReturn(getId(order), {
      notes: returnAction.notes.trim(),
      status: returnAction.status,
    }), 'Unable to process return.')

  const refundOrder = () => 
    handleAction(() => adminApi.refundOrder(getId(order), {
      amount: Number(refund.amount || 0),
      reason: refund.reason.trim(),
    }), 'Unable to refund order.')

  return (
    <div className={`grid gap-5 text-sm ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-3 text-xs font-semibold text-rose-800">
          {error}
        </div>
      )}

      {/* Core Status Management Group */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-slate-700">Order Status</label>
          <div className="flex gap-2">
            <select className={controlClass} value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
              {orderStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button className={secondaryBtnClass} type="button" onClick={updateOrderStatus}>
              Update
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-slate-700">Payment Status</label>
          <div className="flex gap-2">
            <select className={controlClass} value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button className={secondaryBtnClass} type="button" onClick={updatePaymentStatus}>
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Management Block */}
      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
        <label className="font-semibold text-slate-700">Transaction ID</label>
        <div className="flex gap-2">
          <input className={controlClass} value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="e.g. ch_3Mxs2B..." />
          <button className={emeraldBtnClass} type="button" onClick={confirmPayment}>
            Confirm Paid
          </button>
        </div>
      </div>

      {/* Shipping Section */}
      <div className="grid gap-3 border-t border-slate-100 pt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Shipping Logistics</h4>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Tracking Number</label>
            <input className={controlClass} value={shipping.trackingNumber} onChange={(e) => updateShippingField('trackingNumber', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Courier Name</label>
            <input className={controlClass} value={shipping.courierName} onChange={(e) => updateShippingField('courierName', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Est. Delivery Date</label>
            <input className={controlClass} type="date" value={shipping.estimatedDeliveryDate} onChange={(e) => updateShippingField('estimatedDeliveryDate', e.target.value)} />
          </div>
        </div>
        <button className={`${secondaryBtnClass} w-full sm:w-fit`} type="button" onClick={updateShipping}>
          Update Shipping Details
        </button>
      </div>

      {/* Returns and Refunds Section */}
      <div className="grid gap-3 border-t border-slate-100 pt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Returns & Refunds</h4>
        
        <div className="grid gap-3 sm:grid-cols-2 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Return Status</label>
            <select className={controlClass} value={returnAction.status} onChange={(e) => setReturnAction((c) => ({ ...c, status: e.target.value }))}>
              {returnStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Return Notes</label>
            <input className={controlClass} value={returnAction.notes} onChange={(e) => setReturnAction((c) => ({ ...c, notes: e.target.value }))} placeholder="Reason for status change..." />
          </div>
          <div className="sm:col-span-2 mt-1">
            <button className={secondaryBtnClass} type="button" onClick={processReturn}>
              Process Return Request
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 bg-rose-50/20 p-3 rounded-lg border border-rose-100/50">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Refund Amount</label>
            <input className={controlClass} type="number" value={refund.amount} onChange={(e) => setRefund((c) => ({ ...c, amount: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Refund Reason</label>
            <input className={controlClass} value={refund.reason} onChange={(e) => setRefund((c) => ({ ...c, reason: e.target.value }))} />
          </div>
          <div className="sm:col-span-2 mt-1">
            <button className={roseBtnClass} type="button" onClick={refundOrder}>
              Issue Order Refund
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Design Token Layout Classes
const controlClass = 'w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 outline-none text-sm transition-all focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10'

const baseBtnClass = 'inline-flex h-9 items-center justify-center rounded-lg px-4 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
const secondaryBtnClass = `${baseBtnClass} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm`
const emeraldBtnClass = `${baseBtnClass} border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80`
const roseBtnClass = `${baseBtnClass} border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100/80`

const returnStatuses = ['approved', 'rejected', 'received', 'refunded']

const toDateInputValue = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}