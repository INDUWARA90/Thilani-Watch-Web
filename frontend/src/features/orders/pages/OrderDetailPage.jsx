import { Link, useParams } from 'react-router'
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileText,
  MapPin,
  RefreshCcw,
  ShieldAlert,
  Truck,
  XCircle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Clock,
} from 'lucide-react'
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

const OrderDetailPage = () => {
  const { id } = useParams()
  usePageTitle('Order Details | Thilani Watch Web')

  const { cancelOrder, error, isLoading, message, order, requestReturn, returnForm, updateReturnField } = useOrderDetail(id)

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FBFBFA] text-neutral-900 font-sans px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-neutral-200 bg-white p-12 shadow-sm">
            <LoadingState label="Loading order details" variant="form" />
          </div>
        </div>
      </main>
    )
  }

  const orderStatus = order ? getOrderStatus(order) : ''
  const paymentStatus = order ? getPaymentStatus(order) : ''
  const paymentSlip = order ? getPaymentSlip(order) : null

  return (
    <main className="min-h-screen bg-[#FBFBFA] text-neutral-900 font-sans pb-24 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            className="group inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 text-xs font-bold text-neutral-700 no-underline shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
            to="/orders"
          >
            <ArrowLeft className="h-4 w-4 text-neutral-400 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
            Back to Orders
          </Link>
          
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-3 text-xs font-semibold uppercase tracking-widest text-neutral-800 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
            Verified Purchase
          </span>
        </div>

        {/* Notifications & System Banners */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 shadow-sm">
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700 shadow-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            <span>{message}</span>
          </div>
        )}

        {order && <ShippingLogistics order={order} isPriority />}

        {order && (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Main Content Area */}
            <div className="space-y-6">
              
              {/* Primary Order Banner */}
              <section className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Order Reference</span>
                    <h1 className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
                      #{getOrderNumber(order) || getOrderId(order)}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-600 font-medium">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
                        Placed on {formatDate(order.createdAt)}
                      </span>
                      {order.wantedDate && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
                          Requested by {formatDate(order.wantedDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:self-start">
                    <StatusPill label={orderStatus} tone={getStatusTone(orderStatus)} />
                    <StatusPill label={`Pay: ${paymentStatus}`} tone={getStatusTone(paymentStatus)} />
                  </div>
                </div>

                {/* Cancel Action Footer */}
                {canCancelOrder(order) && (
                  <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4">
                    <p className="text-xs font-medium text-neutral-500">
                      Need to modify or drop this order?
                    </p>
                    <button
                      className="inline-flex h-9 items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 text-xs font-bold text-rose-700 transition hover:bg-rose-100 hover:text-rose-800"
                      type="button"
                      onClick={cancelOrder}
                    >
                      <XCircle className="h-4 w-4 text-rose-600" aria-hidden="true" />
                      Cancel Order
                    </button>
                  </div>
                )}
              </section>

              {/* Items List Table */}
              <OrderItemsTable order={order} />

              {/* Addresses Grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                <AddressCard address={order.shippingAddress} title="Shipping Address" />
                {order.billingAddress && <AddressCard address={order.billingAddress} title="Billing Address" />}
              </div>

              {/* Return Workflow Form */}
              {canRequestReturn(order) && (
                <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 font-bold shadow-sm">
                      <RefreshCcw className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="font-heading text-lg font-bold tracking-tight text-neutral-900">Request a Return</h2>
                      <p className="text-xs text-neutral-500">Submit your item return request within the eligible window.</p>
                    </div>
                  </div>

                  <form className="space-y-4" onSubmit={requestReturn}>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        Reason for Return
                      </label>
                      <input
                        className={inputClass}
                        placeholder="e.g., Sizing issue, unexpected defect, wrong variant"
                        required
                        value={returnForm.reason}
                        onChange={(event) => updateReturnField('reason', event.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        Additional Notes
                      </label>
                      <textarea
                        className={`${inputClass} min-h-[100px] py-3 resize-none`}
                        placeholder="Provide extra details on the condition of the watch and packaging..."
                        value={returnForm.notes}
                        onChange={(event) => updateReturnField('notes', event.target.value)}
                      />
                    </div>

                    <button
                      className="inline-flex h-10 items-center justify-center rounded-full bg-black px-6 text-xs font-bold text-white shadow-md transition hover:bg-neutral-800 active:scale-[0.98]"
                      type="submit"
                    >
                      Submit Return Request
                    </button>
                  </form>
                </section>
              )}
            </div>

            {/* Sidebar Summary Area */}
            <aside className="space-y-6">
              <div className="sticky top-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-neutral-900">
                  <ClipboardList className="h-5 w-5 text-neutral-900" aria-hidden="true" />
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <SummaryRow label="Subtotal" value={formatOrderMoney(getOrderSubtotal(order), order.currency)} />
                  <SummaryRow label="Shipping" value={formatOrderMoney(order.shippingFee ?? SHIPPING_FEE, order.currency)} />
                  <SummaryRow
                    isDiscount
                    label="Discount"
                    value={`-${formatOrderMoney(order.discountAmount || order.discount || 0, order.currency)}`}
                  />
                </div>

                <div className="my-5 border-t border-neutral-100" />
                <SummaryRow isStrong label="Total" value={formatOrderMoney(getOrderTotal(order), order.currency)} />

                {/* Payment Method Badge */}
                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs font-semibold text-neutral-700">
                  <CreditCard className="h-4 w-4 shrink-0 text-neutral-900" aria-hidden="true" />
                  <span>
                    Payment Method:{' '}
                    <span className="capitalize font-bold text-neutral-900">{getPaymentMethodLabel(order.paymentMethod)}</span>
                  </span>
                </div>

                {/* Slip Viewer Attachment */}
                {paymentSlip && (
                  <a
                    className="group mt-4 block overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-3.5 transition hover:border-neutral-300 hover:bg-neutral-100/80"
                    href={paymentSlip.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <div className="mb-2 flex items-center justify-between text-xs font-bold text-neutral-900">
                      <span>Attached Payment Slip</span>
                      <ExternalLink className="h-3.5 w-3.5 text-neutral-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </div>

                    {isPaymentSlipImage(paymentSlip) ? (
                      <img
                        alt="Attached payment slip"
                        className="h-36 w-full rounded-xl border border-neutral-200 object-cover shadow-inner"
                        src={paymentSlip.url}
                      />
                    ) : (
                      <div className="flex h-20 items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 text-xs font-medium text-neutral-700">
                        <FileText className="h-6 w-6 text-neutral-900 shrink-0" aria-hidden="true" />
                        <span className="min-w-0 truncate">{paymentSlip.fileName || 'View attached document'}</span>
                      </div>
                    )}
                  </a>
                )}

                <ReturnsRefunds order={order} />
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

const OrderItemsTable = ({ order }) => (
  <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
    <h2 className="mb-5 font-heading text-lg font-bold tracking-tight text-neutral-900">Items Ordered</h2>
    <div className="w-full overflow-x-auto rounded-2xl border border-neutral-200 bg-neutral-50">
      <table className="w-full min-w-[550px] text-left">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            <th className="p-4">Item Name</th>
            <th className="p-4 text-center">Qty</th>
            <th className="p-4 text-right">Unit Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 text-xs">
          {(order.items || []).map((item, index) => (
            <tr className="transition-colors hover:bg-white" key={`${getOrderItemName(item)}-${index}`}>
              <td className="p-4 font-bold text-neutral-900">{getOrderItemName(item)}</td>
              <td className="p-4 text-center font-medium text-neutral-500">{item.quantity}</td>
              <td className="p-4 text-right font-mono font-bold text-neutral-900">
                {formatOrderMoney(getOrderItemPrice(item), order.currency)}
              </td>
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
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-neutral-900" aria-hidden="true" />
        <h2 className="font-heading text-xs font-bold tracking-wider uppercase text-neutral-900">{title}</h2>
      </div>
      <div className="space-y-1 text-xs text-neutral-500 font-medium leading-relaxed">
        <p className="font-bold text-neutral-900">{address.street}</p>
        <p>{[address.city, address.state, address.zip].filter(Boolean).join(', ')}</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">{address.country}</p>
        {address.phone && (
          <p className="mt-3 border-t border-neutral-100 pt-2 text-[11px]">
            Phone: <span className="font-semibold text-neutral-900">{address.phone}</span>
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
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
  neutral: 'border-neutral-200 bg-neutral-50 text-neutral-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
}

const StatusPill = ({ label, tone = 'neutral' }) => (
  <span className={`inline-flex items-center rounded-lg border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${toneClasses[tone] || toneClasses.neutral}`}>
    {label}
  </span>
)

const inputClass =
  'min-h-[44px] min-w-0 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400'

const canRequestReturn = (order) => getOrderStatus(order) === 'delivered' && !order.returnRequest && !order.returnStatus

const hasShippingLogistics = (order) =>
  Boolean(
    getShippingValue(order, 'trackingNumber') ||
      getShippingValue(order, 'courierName') ||
      getShippingValue(order, 'estimatedDeliveryDate') ||
      getShippingValue(order, 'shippedAt') ||
      getShippingValue(order, 'deliveredAt'),
  )

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

const ShippingLogistics = ({ isPriority = false, order }) => {
  if (!hasShippingLogistics(order)) return null

  const courierName = getShippingValue(order, 'courierName')
  const deliveredAt = getShippingValue(order, 'deliveredAt')
  const estimatedDeliveryDate = getShippingValue(order, 'estimatedDeliveryDate')
  const shippedAt = getShippingValue(order, 'shippedAt')
  const trackingNumber = getShippingValue(order, 'trackingNumber')

  return (
    <section className={`${isPriority ? 'mb-8 rounded-3xl p-5 sm:p-6' : 'mt-5 rounded-2xl p-4'} border border-amber-400/35 bg-[linear-gradient(135deg,#050505_0%,#161616_58%,#050505_100%)] shadow-[0_18px_42px_rgba(0,0,0,0.22)]`}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-amber-400/35 bg-amber-400 text-black shadow-[0_10px_26px_rgba(245,158,11,0.24)]">
            <Truck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Delivery Priority</span>
            <h3 className="font-heading text-base font-bold tracking-tight text-white">Shipping Logistics</h3>
          </div>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80">
          Live order movement
        </span>
      </div>
      <div className={`${isPriority ? 'grid gap-3 sm:grid-cols-2 lg:grid-cols-5' : 'space-y-2'} text-xs`}>
        {trackingNumber && <InfoRow isDark isPriority={isPriority} label="Tracking" value={trackingNumber} />}
        <InfoRow isDark isMuted={!courierName} isPriority={isPriority} label="Courier" value={courierName || 'Courier not assigned'} />
        <InfoRow isDark isMuted={!estimatedDeliveryDate} isPriority={isPriority} label="Estimated Delivery" value={estimatedDeliveryDate ? formatDateOnly(estimatedDeliveryDate) : 'Delivery date not set'} />
        <InfoRow isDark isMuted={!shippedAt} isPriority={isPriority} label="Shipped Date" value={shippedAt ? formatDateOnly(shippedAt) : 'Not shipped yet'} />
        {deliveredAt && <InfoRow isDark isPriority={isPriority} label="Delivered Date" value={formatDateOnly(deliveredAt)} />}
      </div>
    </section>
  )
}

export default OrderDetailPage

const getShippingValue = (order, key) => order?.[key] || order?.shipping?.[key]

const formatDateOnly = (value) => {
  if (!value) return 'Not set'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not set'

  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date)
}

const ReturnsRefunds = ({ order }) => {
  if (!hasReturnsRefunds(order)) return null

  const returnRequest = order.returnRequest || {}
  const refund = order.refund || {}

  return (
    <section className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
      <h3 className="mb-3 flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-wider text-neutral-900">
        <RefreshCcw className="h-4 w-4 text-neutral-900" aria-hidden="true" />
        Returns & Refunds
      </h3>
      <div className="space-y-2 text-xs">
        {returnRequest.status && returnRequest.status !== 'none' && <InfoRow label="Return Status" value={returnRequest.status} />}
        {returnRequest.reason && <InfoRow label="Reason" value={returnRequest.reason} />}
        {returnRequest.notes && <InfoRow label="Notes" value={returnRequest.notes} />}
        {returnRequest.requestedAt && <InfoRow label="Requested" value={formatDate(returnRequest.requestedAt)} />}
        {returnRequest.processedAt && <InfoRow label="Processed" value={formatDate(returnRequest.processedAt)} />}
        {refund.status && refund.status !== 'none' && <InfoRow label="Refund Status" value={refund.status} />}
        {refund.amount > 0 && <InfoRow label="Refund Amount" value={formatOrderMoney(refund.amount, order.currency)} />}
        {refund.reason && <InfoRow label="Refund Reason" value={refund.reason} />}
        {refund.refundedAt && <InfoRow label="Refunded Date" value={formatDate(refund.refundedAt)} />}
      </div>
    </section>
  )
}

const InfoRow = ({ isDark = false, isMuted = false, isPriority = false, label, value }) => (
  <div className={`${isPriority ? 'min-h-20 flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]' : ''} flex items-start justify-between gap-3 text-xs`}>
    <span className={`shrink-0 font-medium ${isDark ? 'text-white/65' : 'text-neutral-500'}`}>{label}</span>
    <span className={`min-w-0 font-bold capitalize ${isPriority ? 'text-left text-sm leading-snug' : 'text-right'} ${isMuted ? 'text-white/55' : isDark ? 'text-white' : 'text-neutral-900'}`}>{value}</span>
  </div>
)

const SummaryRow = ({ isStrong = false, label, value, isDiscount = false }) => (
  <div className="flex items-center justify-between gap-3 text-xs">
    <span className={isStrong ? 'font-bold text-neutral-900' : 'font-medium text-neutral-500'}>{label}</span>
    <strong
      className={
        isStrong
          ? 'font-mono text-xl font-extrabold text-neutral-900'
          : isDiscount
            ? 'font-mono text-emerald-600 font-bold'
            : 'font-mono font-bold text-neutral-900'
      }
    >
      {value}
    </strong>
  </div>
)
