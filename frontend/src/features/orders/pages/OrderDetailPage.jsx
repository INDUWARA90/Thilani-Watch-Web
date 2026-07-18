import { Link, useParams } from 'react-router'
import { ArrowLeft, CalendarDays, ClipboardList, CreditCard, MapPin, RefreshCcw, ShieldAlert, XCircle } from 'lucide-react'
import { LoadingState } from '@/shared/ui/LoadingState'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import {
  canCancelOrder,
  formatDate,
  formatOrderMoney,
  getOrderId,
  getOrderItemName,
  getOrderItemPrice,
  getPaymentMethodLabel,
  getPaymentSlip,
  getOrderStatus,
  getOrderSubtotal,
  getOrderTotal,
  getPaymentStatus,
  SHIPPING_FEE,
} from '@/features/orders/lib/orderUtils'
import { useOrderDetail } from '@/features/orders/hooks/useOrderDetail'

export const OrderDetailPage = () => {
  const { id } = useParams()
  usePageTitle('Order Details | Thilani Watch Web')

  const { cancelOrder, error, isLoading, message, order, requestReturn, returnForm, updateReturnField } = useOrderDetail(id)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1200px] p-6">
        <LoadingState label="Loading order details" variant="form" />
      </div>
    )
  }

  const orderStatus = order ? getOrderStatus(order) : ''
  const paymentStatus = order ? getPaymentStatus(order) : ''
  const paymentSlip = order ? getPaymentSlip(order) : null

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8 bg-white min-h-screen sm:px-6 lg:px-8">
      {/* Back Button Link */}
      <Link 
        className="mb-6 inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-700 no-underline shadow-sm transition-all duration-200 hover:bg-slate-50 hover:text-slate-900" 
        to="/orders"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>

      {/* Modern Alert Notifications */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 flex items-center gap-2.5 shadow-sm animate-fade-in">
          <ShieldAlert className="h-5 w-5 shrink-0 text-red-500" />
          {error}
        </div>
      )}
      
      {message && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700 flex items-center gap-2.5 shadow-sm animate-fade-in">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">✓</span>
          {message}
        </div>
      )}

      {order && (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-6">
            {/* Essential Header Banner Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Order Ref</p>
                  <h1 className="text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">
                    {order.orderNumber || getOrderId(order)}
                  </h1>
                  <p className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 sm:self-start">
                  <StatusPill label={orderStatus} tone={getStatusTone(orderStatus)} />
                  <StatusPill label={`Payment: ${paymentStatus}`} tone={getStatusTone(paymentStatus)} />
                </div>
              </div>

              {/* Action Drawer Footer within Header */}
              {canCancelOrder(order) && (
                <div className="mt-6 border-t border-slate-100 pt-4 flex justify-end">
                  <button 
                    className="inline-flex h-9 items-center gap-2 rounded-xl border border-red-200 bg-red-50/50 px-4 text-xs font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700" 
                    type="button" 
                    onClick={cancelOrder}
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel order
                  </button>
                </div>
              )}
            </div>

            {/* Custom Interactive Section Cards */}
            <OrderItemsTable order={order} />
            
            <div className="grid gap-6 sm:grid-cols-2">
              <AddressCard address={order.shippingAddress} title="Shipping Address" />
              {order.billingAddress && <AddressCard address={order.billingAddress} title="Billing Address" />}
            </div>

            {/* Return Request Workflow Area */}
            {canRequestReturn(order) && (
              <form className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]" onSubmit={requestReturn}>
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                    <RefreshCcw className="h-4 w-4" />
                  </span>
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">Request a return</h2>
                </div>
                
                <div className="grid gap-4">
                  <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                    Reason for return
                    <input 
                      className={inputClass} 
                      placeholder="e.g., Sizing issue, incorrect model variant" 
                      required 
                      value={returnForm.reason} 
                      onChange={(event) => updateReturnField('reason', event.target.value)} 
                    />
                  </label>
                  
                  <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                    Additional details
                    <textarea 
                      className={`${inputClass} min-h-[90px] py-2.5 resize-none`} 
                      placeholder="Provide additional details regarding the watch's current condition..."
                      value={returnForm.notes} 
                      onChange={(event) => updateReturnField('notes', event.target.value)} 
                    />
                  </label>
                  
                  <button className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-800 sm:w-fit" type="submit">
                    Submit return request
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Checkout Right Invoice Sidebar */}
          <aside className="sticky top-6 h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <h2 className="mb-4 text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-slate-400" />
              Summary
            </h2>
            
            <div className="space-y-3.5">
              <SummaryRow label="Subtotal" value={formatOrderMoney(getOrderSubtotal(order), order.currency)} />
              <SummaryRow label="Shipping" value={formatOrderMoney(order.shippingFee ?? SHIPPING_FEE, order.currency)} />
              <SummaryRow label="Discount" value={`-${formatOrderMoney(order.discountAmount || order.discount || 0, order.currency)}`} isDiscount />
            </div>

            <div className="my-4 border-t border-slate-100" />
            <SummaryRow isStrong label="Total" value={formatOrderMoney(getOrderTotal(order), order.currency)} />
            
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
              <CreditCard className="h-4 w-4 text-slate-400" />
              <span>Payment method: <span className="text-slate-800 capitalize">{getPaymentMethodLabel(order.paymentMethod)}</span></span>
            </div>

            {paymentSlip && (
              <a className="mt-3 block overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs font-semibold text-slate-600 no-underline transition hover:border-orange-200 hover:bg-orange-50/40" href={paymentSlip.url} rel="noreferrer" target="_blank">
                <span className="mb-2 block text-slate-800">Attached payment slip</span>
                <img alt="Attached payment slip" className="h-32 w-full rounded-lg border border-slate-100 bg-white object-cover" src={paymentSlip.url} />
              </a>
            )}
          </aside>
        </section>
      )}
    </main>
  )
}

const OrderItemsTable = ({ order }) => (
  <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
    <h2 className="mb-4 text-lg font-bold text-slate-800 tracking-tight">Items Ordered</h2>
    <div className="w-full overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr className="bg-slate-50/70">
            <th className="border-b border-slate-100 p-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Item Name</th>
            <th className="border-b border-slate-100 p-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-400 w-24">Qty</th>
            <th className="border-b border-slate-100 p-3.5 text-right text-xs font-bold uppercase tracking-wider text-slate-400 w-36">Unit Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {(order.items || []).map((item, index) => (
            <tr key={`${getOrderItemName(item)}-${index}`} className="hover:bg-slate-50/30 transition-colors">
              <td className="p-3.5 text-sm font-semibold text-slate-700 align-middle">{getOrderItemName(item)}</td>
              <td className="p-3.5 text-sm font-medium text-slate-600 text-center align-middle">{item.quantity}</td>
              <td className="p-3.5 text-sm font-bold text-slate-800 text-right align-middle">{formatOrderMoney(getOrderItemPrice(item), order.currency)}</td>
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
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-2.5">
      <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
        <MapPin className="h-4 w-4 text-slate-400" />
        {title}
      </h2>
      <div className="text-sm font-medium leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-800">{address.street}</p>
        <p>{[address.city, address.state, address.zip].filter(Boolean).join(', ')}</p>
        <p className="tracking-wide uppercase text-xs font-bold text-slate-400 mt-0.5">{address.country}</p>
        {address.phone && (
          <p className="mt-2 text-xs border-t border-slate-50 pt-2 text-slate-400">
            Phone: <span className="text-slate-600 font-semibold">{address.phone}</span>
          </p>
        )}
      </div>
    </section>
  )
}

const getStatusTone = (value) => {
  const normalized = String(value || '').toLowerCase()
  if (['paid', 'delivered', 'completed', 'success'].includes(normalized)) return 'success'
  if (['cancelled', 'canceled', 'failed', 'rejected', 'refunded'].includes(normalized)) return 'danger'
  if (['pending', 'confirmed', 'processing', 'shipped'].includes(normalized)) return 'warning'
  return 'neutral'
}

const toneClasses = {
  danger: 'border-red-100 bg-red-50 text-red-700',
  neutral: 'border-slate-100 bg-slate-50 text-slate-600',
  success: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200/60 bg-amber-50 text-amber-800',
}

const StatusPill = ({ label, tone = 'success' }) => (
  <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize tracking-wide ${toneClasses[tone] || toneClasses.neutral}`}>
    {label}
  </span>
)

const inputClass = 'min-h-[44px] min-w-0 w-full rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-400/10'

const canRequestReturn = (order) => getOrderStatus(order) === 'delivered' && !order.returnRequest && !order.returnStatus

const SummaryRow = ({ isStrong = false, label, value, isDiscount = false }) => (
  <div className="flex items-center justify-between gap-3">
    <span className={`${isStrong ? 'text-base font-bold text-slate-800' : 'text-sm font-medium text-slate-500'}`}>{label}</span>
    <strong className={`${
      isStrong 
        ? 'text-xl text-[#EB960E] font-black' 
        : isDiscount 
          ? 'text-sm text-emerald-600 font-semibold' 
          : 'text-sm text-slate-800 font-semibold'
    }`}>
      {value}
    </strong>
  </div>
)
