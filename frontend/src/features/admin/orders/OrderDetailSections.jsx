import { formatDate, formatMoney, getTitle } from '../lib/adminUtils'
import { FileText, RefreshCcw, Truck } from 'lucide-react'
import { getOrderNumber, getPaymentMethodLabel, getPaymentSlip, isPaymentSlipImage } from '@/features/orders/lib/orderUtils'
import { OrderStatusControls } from './OrderStatusControls'

export const OrderDetailSections = ({ order, onUpdated }) => {
  const paymentSlip = getPaymentSlip(order)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(320px,1fr)_minmax(0,2fr)]">
      {/* Summary Section */}
      <section className="flex flex-col gap-5 rounded-xl border border-black/10 bg-[#FFFEFA] p-6 shadow-sm">
        <div>
          <h3 className="font-heading text-lg font-bold tracking-wide text-primary">Summary</h3>
          <p className="text-xs text-primary">Overview of the order details</p>
        </div>

        <div className="grid gap-3 text-sm border-t border-black/5 pt-4">
          {(getOrderNumber(order) || order._id) && (
            <div className="flex justify-between items-center py-1">
              <span className="text-primary font-medium">Order No</span>
              <span className="font-semibold text-primary">{getOrderNumber(order) || order._id}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-1">
            <span className="text-primary font-medium">Customer</span>
            <span className="font-semibold text-primary">{getTitle(order.user, 'Customer')}</span>
          </div>
          {order.wantedDate && (
            <div className="flex justify-between items-center py-1">
              <span className="text-primary font-medium">Wanted Date</span>
              <span className="text-primary">{formatDate(order.wantedDate)}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-1">
            <span className="text-primary font-medium">Created</span>
            <span className="text-primary">{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-primary font-medium">Payment Method</span>
            <span className="font-semibold capitalize text-primary">{getPaymentMethodLabel(order.paymentMethod)}</span>
          </div>
          <div className="flex justify-between items-center py-1 bg-[#FAF9F5] -mx-6 px-6 my-1">
            <span className="text-primary font-semibold">Total Amount</span>
            <span className="text-base font-bold text-primary">
              {formatMoney(order.totalAmount ?? order.total, order.currency)}
            </span>
          </div>
        </div>

        {paymentSlip && (
          <a className="block rounded-xl border border-black/5 bg-[#FAF9F5] p-3 text-xs font-semibold text-primary no-underline transition hover:border-accent/35 hover:bg-accent/10" href={paymentSlip.url} rel="noreferrer" target="_blank">
            <span className="mb-2 block text-primary">Payment Slip</span>
            {isPaymentSlipImage(paymentSlip) ? (
              <img alt="Customer payment slip" className="h-36 w-full rounded-lg border border-black/5 bg-[#FFFEFA] object-cover" src={paymentSlip.url} />
            ) : (
              <span className="flex min-h-24 items-center gap-3 rounded-lg border border-black/5 bg-[#FFFEFA] p-4 text-primary">
                <FileText className="h-6 w-6 text-accent" />
                <span className="min-w-0 truncate">{paymentSlip.fileName || 'Open attached slip'}</span>
              </span>
            )}
          </a>
        )}

        <ShippingLogistics order={order} />
        <ReturnsRefunds order={order} />

        <div className="mt-auto border-t border-black/5 pt-4">
          <OrderStatusControls order={order} onUpdated={onUpdated} />
        </div>
      </section>

      {/* Items Section */}
      <section className="flex flex-col gap-4 rounded-xl border border-black/10 bg-[#FFFEFA] p-6 shadow-sm">
        <div>
          <h3 className="font-heading text-lg font-bold tracking-wide text-primary">Items</h3>
          <p className="text-xs text-primary">Products included in this order</p>
        </div>

        <div className="w-full overflow-x-auto rounded-lg border border-black/5">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#FAF9F5]/85 border-b border-black/10">
                <th className="p-3 text-left font-semibold text-primary">Item</th>
                <th className="p-3 text-left font-semibold text-primary">SKU</th>
                <th className="p-3 text-right font-semibold text-primary">Qty</th>
                <th className="p-3 text-right font-semibold text-primary">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {(order.items || []).map((item) => (
                <tr
                  key={`${item.sku}-${item.name}`}
                  className="transition-colors hover:bg-[#FAF9F5]/80"
                >
                  <td className="p-3 text-left font-medium text-primary max-w-[240px] truncate">
                    {item.name || getTitle(item.watch)}
                  </td>
                  <td className="p-3 text-left font-sans text-xs text-primary">
                    {item.sku}
                  </td>
                  <td className="p-3 text-right font-sans text-primary">
                    {item.quantity}
                  </td>
                  <td className="p-3 text-right font-semibold text-primary">
                    {formatMoney(item.price, order.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

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
    <section className="rounded-xl border border-black/5 bg-[#FAF9F5] p-4">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
        <Truck className="h-4 w-4 text-accent" />
        Shipping Logistics
      </h4>
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
    <section className="rounded-xl border border-black/5 bg-[#FAF9F5] p-4">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
        <RefreshCcw className="h-4 w-4 text-accent" />
        Returns & Refunds
      </h4>
      <div className="grid gap-2 text-xs">
        {returnRequest.status && returnRequest.status !== 'none' && <InfoRow label="Return status" value={returnRequest.status} />}
        {returnRequest.reason && <InfoRow label="Reason" value={returnRequest.reason} />}
        {returnRequest.notes && <InfoRow label="Notes" value={returnRequest.notes} />}
        {returnRequest.requestedAt && <InfoRow label="Requested" value={formatDate(returnRequest.requestedAt)} />}
        {returnRequest.processedAt && <InfoRow label="Processed" value={formatDate(returnRequest.processedAt)} />}
        {refund.status && refund.status !== 'none' && <InfoRow label="Refund status" value={refund.status} />}
        {refund.amount > 0 && <InfoRow label="Refund amount" value={formatMoney(refund.amount, order.currency)} />}
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


