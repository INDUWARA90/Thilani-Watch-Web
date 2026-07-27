import { Link, useParams } from 'react-router'
import { ArrowLeft, CalendarDays, ClipboardList, CreditCard, FileText, MapPin, RefreshCcw, ShieldAlert, Truck, XCircle } from 'lucide-react'
import { LoadingState } from '@/shared/ui/LoadingState'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import {
  canCancelOrder,
  formatDate,
  formatOrderMoney,
  getOrderId,
  getOrderItemName,
  getOrderItemPrice,
  getOrderNumber,
  getPaymentMethodLabel,
  getPaymentSlip,
  getOrderStatus,
  getOrderSubtotal,
  getOrderTotal,
  getPaymentStatus,
  SHIPPING_FEE,
  isPaymentSlipImage,
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
    <main className="mx-auto min-h-screen max-w-[1200px] bg-base px-4 py-8 text-primary sm:px-6 lg:px-8">
      {/* Back Button Link */}
      <Link 
        className="mb-6 inline-flex h-10 items-center gap-2 rounded-full border border-primary/10 bg-card px-5 text-xs font-bold text-primary no-underline shadow-sm transition hover:border-primary/10 hover:shadow-premiumSm" 
        to="/orders"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>

      {/* Modern Alert Notifications */}
      {error && (
        <div className="mb-6 flex animate-fade-in items-center gap-2.5 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm font-medium text-red-200 shadow-sm">
          <ShieldAlert className="h-5 w-5 shrink-0 text-red-200" />
          {error}
        </div>
      )}
      
      {message && (
        <div className="mb-6 flex animate-fade-in items-center gap-2.5 rounded-lg border border-emerald-300/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-200 shadow-sm">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-primary text-xs font-bold">✓</span>
          {message}
        </div>
      )}

      {order && (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-6">
            {/* Essential Header Banner Card */}
            <div className="relative overflow-hidden rounded-lg border border-primary/10 bg-card p-6 shadow-premiumSm">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase text-primary">Order Ref</p>
                  <h1 className="font-heading text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                    {getOrderNumber(order) || getOrderId(order)}
                  </h1>
                  <p className="mt-2 flex items-center gap-2 text-xs font-medium text-primary">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Placed on {formatDate(order.createdAt)}
                  </p>
                  {order.wantedDate && (
                    <p className="mt-2 flex items-center gap-2 text-xs font-medium text-primary">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      Wanted date {formatDate(order.wantedDate)}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-2 sm:self-start">
                  <StatusPill label={orderStatus} tone={getStatusTone(orderStatus)} />
                  <StatusPill label={`Payment: ${paymentStatus}`} tone={getStatusTone(paymentStatus)} />
                </div>
              </div>

              {/* Action Drawer Footer within Header */}
              {canCancelOrder(order) && (
                <div className="mt-6 flex justify-end border-t border-primary/10 pt-4">
                  <button 
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-4 text-xs font-bold text-red-200 transition hover:bg-red-500/20" 
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
              <form className="rounded-lg border border-primary/10 bg-card p-6 shadow-premiumSm" onSubmit={requestReturn}>
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary">
                    <RefreshCcw className="h-4 w-4" />
                  </span>
                  <h2 className="font-heading text-lg font-bold tracking-tight text-primary">Request a return</h2>
                </div>
                
                <div className="grid gap-4">
                  <label className="grid gap-1.5 text-sm font-semibold text-primary">
                    Reason for return
                    <input 
                      className={inputClass} 
                      placeholder="e.g., Sizing issue, incorrect model variant" 
                      required 
                      value={returnForm.reason} 
                      onChange={(event) => updateReturnField('reason', event.target.value)} 
                    />
                  </label>
                  
                  <label className="grid gap-1.5 text-sm font-semibold text-primary">
                    Additional details
                    <textarea 
                      className={`${inputClass} min-h-[90px] py-2.5 resize-none`} 
                      placeholder="Provide additional details regarding the watch's current condition..."
                      value={returnForm.notes} 
                      onChange={(event) => updateReturnField('notes', event.target.value)} 
                    />
                  </label>
                  
                  <button className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-black transition hover:shadow-premiumSm sm:w-fit" type="submit">
                    Submit return request
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Checkout Right Invoice Sidebar */}
          <aside className="sticky top-6 h-fit rounded-lg border border-primary/10 bg-card p-6 shadow-premiumSm">
            <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-primary">
              <ClipboardList className="h-4 w-4 text-primary" />
              Summary
            </h2>
            
            <div className="space-y-3.5">
              <SummaryRow label="Subtotal" value={formatOrderMoney(getOrderSubtotal(order), order.currency)} />
              <SummaryRow label="Shipping" value={formatOrderMoney(order.shippingFee ?? SHIPPING_FEE, order.currency)} />
              <SummaryRow label="Discount" value={`-${formatOrderMoney(order.discountAmount || order.discount || 0, order.currency)}`} isDiscount />
            </div>

            <div className="my-4 border-t border-primary/10" />
            <SummaryRow isStrong label="Total" value={formatOrderMoney(getOrderTotal(order), order.currency)} />
            
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-primary/10 bg-card px-4 py-3 text-xs font-semibold text-primary">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>Payment method: <span className="capitalize text-primary">{getPaymentMethodLabel(order.paymentMethod)}</span></span>
            </div>

            {paymentSlip && (
              <a className="mt-3 block overflow-hidden rounded-lg border border-primary/10 bg-card p-3 text-xs font-semibold text-primary no-underline transition hover:border-primary/10 hover:shadow-premiumSm" href={paymentSlip.url} rel="noreferrer" target="_blank">
                <span className="mb-2 block text-primary">Attached payment slip</span>
                {isPaymentSlipImage(paymentSlip) ? (
                  <img alt="Attached payment slip" className="h-32 w-full rounded-lg border border-primary/10 bg-black/35 object-cover" src={paymentSlip.url} />
                ) : (
                  <span className="flex min-h-24 items-center gap-3 rounded-lg border border-primary/10 bg-black/35 p-4 text-primary">
                    <FileText className="h-6 w-6 text-primary" />
                    <span className="min-w-0 truncate">{paymentSlip.fileName || 'Open attached slip'}</span>
                  </span>
                )}
              </a>
            )}

            <ShippingLogistics order={order} />
            <ReturnsRefunds order={order} />
          </aside>
        </section>
      )}
    </main>
  )
}

const OrderItemsTable = ({ order }) => (
  <section className="rounded-lg border border-primary/10 bg-card p-6 shadow-premiumSm">
    <h2 className="mb-4 font-heading text-lg font-bold tracking-tight text-primary">Items Ordered</h2>
    <div className="w-full overflow-x-auto rounded-lg border border-primary/10">
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr className="bg-card">
            <th className="border-b border-primary/10 p-3.5 text-left text-xs font-bold uppercase text-primary">Item Name</th>
            <th className="w-24 border-b border-primary/10 p-3.5 text-center text-xs font-bold uppercase text-primary">Qty</th>
            <th className="w-36 border-b border-primary/10 p-3.5 text-right text-xs font-bold uppercase text-primary">Unit Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/10">
          {(order.items || []).map((item, index) => (
            <tr key={`${getOrderItemName(item)}-${index}`} className="transition-colors hover:bg-accent/[0.03]">
              <td className="p-3.5 align-middle text-sm font-semibold text-primary">{getOrderItemName(item)}</td>
              <td className="p-3.5 text-center align-middle text-sm font-medium text-primary">{item.quantity}</td>
              <td className="p-3.5 text-right align-middle text-sm font-bold text-primary">{formatOrderMoney(getOrderItemPrice(item), order.currency)}</td>
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
    <section className="flex flex-col gap-2.5 rounded-lg border border-primary/10 bg-card p-6 shadow-premiumSm">
      <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-wide text-primary">
        <MapPin className="h-4 w-4 text-primary" />
        {title}
      </h2>
      <div className="text-sm font-medium leading-relaxed text-primary">
        <p className="font-semibold text-primary">{address.street}</p>
        <p>{[address.city, address.state, address.zip].filter(Boolean).join(', ')}</p>
        <p className="mt-0.5 text-xs font-bold uppercase text-primary">{address.country}</p>
        {address.phone && (
          <p className="mt-2 border-t border-primary/10 pt-2 text-xs text-primary">
            Phone: <span className="font-semibold text-primary">{address.phone}</span>
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
  danger: 'border-red-400/25 bg-red-500/10 text-red-200',
  neutral: 'border-primary/10 bg-card text-primary',
  success: 'border-emerald-300/25 bg-emerald-500/10 text-emerald-200',
  warning: 'border-primary/10 bg-primary/5 text-primary',
}

const StatusPill = ({ label, tone = 'success' }) => (
  <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize tracking-wide ${toneClasses[tone] || toneClasses.neutral}`}>
    {label}
  </span>
)

const inputClass = 'min-h-[44px] min-w-0 w-full rounded-lg border border-primary/10 bg-black/35 px-4 py-2.5 text-sm text-primary outline-none transition placeholder:text-primary focus:border-primary/10 focus:ring-2 focus:ring-accent/30'

const canRequestReturn = (order) => getOrderStatus(order) === 'delivered' && !order.returnRequest && !order.returnStatus

const hasShippingLogistics = (order) =>
  Boolean(order?.trackingNumber || order?.courierName || order?.estimatedDeliveryDate || order?.shippedAt || order?.deliveredAt)

const hasReturnsRefunds = (order) => {
  const returnRequest = order?.returnRequest
  const refund = order?.refund

  return Boolean(
    (returnRequest?.status && returnRequest.status !== 'none') ||
      returnRequest?.reason ||
      returnRequest?.notes ||
      returnRequest?.requestedAt ||
      returnRequest?.processedAt ||
      (refund?.status && refund.status !== 'none') ||
      refund?.amount ||
      refund?.reason ||
      refund?.refundedAt,
  )
}

const ShippingLogistics = ({ order }) => {
  if (!hasShippingLogistics(order)) return null

  return (
    <section className="mt-4 rounded-lg border border-primary/10 bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-bold tracking-wide text-primary">
        <Truck className="h-4 w-4 text-primary" />
        Shipping Logistics
      </h3>
      <div className="grid gap-2 text-xs">
        {order.trackingNumber && <InfoRow label="Tracking" value={order.trackingNumber} />}
        {order.courierName && <InfoRow label="Courier" value={order.courierName} />}
        {order.estimatedDeliveryDate && <InfoRow label="Estimated delivery" value={formatDate(order.estimatedDeliveryDate)} />}
        {order.shippedAt && <InfoRow label="Shipped" value={formatDate(order.shippedAt)} />}
        {order.deliveredAt && <InfoRow label="Delivered" value={formatDate(order.deliveredAt)} />}
      </div>
    </section>
  )
}

const ReturnsRefunds = ({ order }) => {
  if (!hasReturnsRefunds(order)) return null

  const returnRequest = order.returnRequest || {}
  const refund = order.refund || {}

  return (
    <section className="mt-4 rounded-lg border border-primary/10 bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-bold tracking-wide text-primary">
        <RefreshCcw className="h-4 w-4 text-primary" />
        Returns & Refunds
      </h3>
      <div className="grid gap-2 text-xs">
        {returnRequest.status && returnRequest.status !== 'none' && <InfoRow label="Return status" value={returnRequest.status} />}
        {returnRequest.reason && <InfoRow label="Reason" value={returnRequest.reason} />}
        {returnRequest.notes && <InfoRow label="Notes" value={returnRequest.notes} />}
        {returnRequest.requestedAt && <InfoRow label="Requested" value={formatDate(returnRequest.requestedAt)} />}
        {returnRequest.processedAt && <InfoRow label="Processed" value={formatDate(returnRequest.processedAt)} />}
        {refund.status && refund.status !== 'none' && <InfoRow label="Refund status" value={refund.status} />}
        {refund.amount > 0 && <InfoRow label="Refund amount" value={formatOrderMoney(refund.amount, order.currency)} />}
        {refund.reason && <InfoRow label="Refund reason" value={refund.reason} />}
        {refund.refundedAt && <InfoRow label="Refunded" value={formatDate(refund.refundedAt)} />}
      </div>
    </section>
  )
}

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-3">
    <span className="shrink-0 font-semibold text-primary">{label}</span>
    <span className="min-w-0 text-right font-bold capitalize text-primary">{value}</span>
  </div>
)

const SummaryRow = ({ isStrong = false, label, value, isDiscount = false }) => (
  <div className="flex items-center justify-between gap-3">
    <span className={`${isStrong ? 'text-base font-bold text-primary' : 'text-sm font-medium text-primary'}`}>{label}</span>
    <strong className={`${
      isStrong 
        ? 'text-xl text-primary font-black' 
        : isDiscount 
          ? 'text-sm text-emerald-600 font-semibold' 
          : 'text-sm text-primary font-semibold'
    }`}>
      {value}
    </strong>
  </div>
)
