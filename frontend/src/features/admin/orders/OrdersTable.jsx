import { Link } from 'react-router'
import { formatDate, formatMoney, getId, getTitle } from '../lib/adminUtils'
import { getOrderNumber } from '@/features/orders/lib/orderUtils'

// Helper to resolve badge styles based on order/payment status string values
const getStatusStyles = (status) => {
  const norm = String(status || '').toLowerCase()
  if (['delivered', 'paid', 'completed', 'active'].includes(norm)) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
  }
  if (['pending', 'processing', 'awaiting_payment'].includes(norm)) {
    return 'bg-amber-50 text-amber-700 border-amber-200/60'
  }
  if (['cancelled', 'failed', 'refunded'].includes(norm)) {
    return 'bg-rose-50 text-rose-700 border-rose-200/60'
  }
  return 'bg-black/5 text-primary border-black/10'
}

export const OrdersTable = ({
  orders,
  emptyMessage = 'There are no active orders available in this scope.',
  emptyTitle = 'No records found',
}) => (
  <div className="w-full overflow-hidden rounded-xl border border-black/10 bg-[#FFFEFA] shadow-sm">
    <div className="divide-y divide-black/5 md:hidden">
      {orders.map((order) => {
        const orderId = getId(order)
        return (
          <article className="p-4" key={orderId}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words font-sans text-xs font-bold text-primary">
                  {getOrderNumber(order) || `#${orderId.slice(-6)}`}
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-primary">
                  {getTitle(order.user, 'Customer')}
                </p>
              </div>
              <p className="shrink-0 text-right font-sans text-sm font-bold text-primary">
                {formatMoney(order.totalAmount ?? order.total, order.currency)}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="min-w-0">
                <p className="mb-1 font-bold uppercase tracking-wide text-primary">Status</p>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-medium capitalize ${getStatusStyles(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="min-w-0">
                <p className="mb-1 font-bold uppercase tracking-wide text-primary">Payment</p>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-medium capitalize ${getStatusStyles(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-bold uppercase tracking-wide text-primary">Wanted</p>
                <p className="mt-1 font-medium text-primary">{formatDate(order.wantedDate)}</p>
              </div>
              <div className="min-w-0">
                <p className="font-bold uppercase tracking-wide text-primary">Created</p>
                <p className="mt-1 font-medium text-primary">{formatDate(order.createdAt)}</p>
              </div>
            </div>

            <Link
              className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-xs font-bold text-accent no-underline transition hover:border-accent/40 hover:text-primary"
              to={`/admin/orders/${orderId}`}
            >
              Details
            </Link>
          </article>
        )
      })}

      {orders.length === 0 && (
        <div className="p-8 text-center text-primary">
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="text-base text-primary">{emptyTitle}</span>
            <span className="text-xs font-normal text-primary">{emptyMessage}</span>
          </div>
        </div>
      )}
    </div>

    <div className="hidden w-full overflow-x-auto md:block">
    <table className="w-full min-w-[940px] border-collapse text-sm text-primary">
      <thead>
        <tr className="bg-[#FAF9F5]/85 border-b border-black/10">
          <th className="p-4 text-left font-semibold text-primary w-[120px]">Order</th>
          <th className="p-4 text-left font-semibold text-primary">Customer</th>
          <th className="p-4 text-right font-semibold text-primary">Total</th>
          <th className="p-4 text-left font-semibold text-primary">Status</th>
          <th className="p-4 text-left font-semibold text-primary">Payment</th>
          <th className="p-4 text-left font-semibold text-primary">Wanted Date</th>
          <th className="p-4 text-left font-semibold text-primary">Created</th>
          <th className="p-4 w-[80px]"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-black/5">
        {orders.map((order) => {
          const orderId = getId(order)
          return (
            <tr 
              key={orderId} 
              className="transition-colors hover:bg-[#FAF9F5]/80 group"
            >
              {/* Order Number / ID */}
              <td className="p-4 text-left align-middle font-sans text-xs font-semibold text-primary">
                {getOrderNumber(order) || `#${orderId.slice(-6)}`}
              </td>

              {/* Customer */}
              <td className="p-4 text-left align-middle font-medium text-primary">
                {getTitle(order.user, 'Customer')}
              </td>

              {/* Total */}
              <td className="p-4 text-right align-middle font-sans font-semibold text-primary">
                {formatMoney(order.totalAmount ?? order.total, order.currency)}
              </td>

              {/* Order Status */}
              <td className="p-4 text-left align-middle">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusStyles(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </td>

              {/* Payment Status */}
              <td className="p-4 text-left align-middle">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusStyles(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </td>

              {/* Wanted Date */}
              <td className="p-4 text-left align-middle text-primary text-xs">
                {formatDate(order.wantedDate)}
              </td>

              {/* Created Date */}
              <td className="p-4 text-left align-middle text-primary text-xs">
                {formatDate(order.createdAt)}
              </td>

              {/* Details Action CTA */}
              <td className="p-4 text-right align-middle">
                <Link 
                  className="inline-flex items-center justify-center font-semibold text-accent no-underline hover:text-primary transition-colors group-hover:translate-x-0.5 transform duration-150" 
                  to={`/admin/orders/${orderId}`}
                >
                  Details <span className="ml-1 font-normal">→</span>
                </Link>
              </td>
            </tr>
          )
        })}
        
        {/* Empty State Block */}
        {orders.length === 0 && (
          <tr>
            <td className="p-12 text-center text-primary font-medium" colSpan="8">
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-base text-primary">{emptyTitle}</span>
                <span className="text-xs text-primary font-normal">{emptyMessage}</span>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
    </div>
  </div>
)


