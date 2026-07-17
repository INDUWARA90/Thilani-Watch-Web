import { Link } from 'react-router'
import { formatDate, formatMoney, getId, getTitle } from '../lib/adminUtils'

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
  return 'bg-slate-100 text-slate-700 border-slate-200'
}

export const OrdersTable = ({ orders }) => (
  <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
    <table className="w-full min-w-[840px] border-collapse text-sm text-slate-600">
      <thead>
        <tr className="bg-slate-50/75 border-b border-slate-200">
          <th className="p-4 text-left font-semibold text-slate-700 w-[120px]">Order</th>
          <th className="p-4 text-left font-semibold text-slate-700">Customer</th>
          <th className="p-4 text-right font-semibold text-slate-700">Total</th>
          <th className="p-4 text-left font-semibold text-slate-700">Status</th>
          <th className="p-4 text-left font-semibold text-slate-700">Payment</th>
          <th className="p-4 text-left font-semibold text-slate-700">Created</th>
          <th className="p-4 w-[80px]"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {orders.map((order) => {
          const orderId = getId(order)
          return (
            <tr 
              key={orderId} 
              className="transition-colors hover:bg-slate-50/50 group"
            >
              {/* Order Number / ID */}
              <td className="p-4 text-left align-middle font-mono text-xs font-semibold text-slate-900">
                #{order.orderNumber || orderId.slice(-6)}
              </td>

              {/* Customer */}
              <td className="p-4 text-left align-middle font-medium text-slate-900">
                {getTitle(order.user, 'Customer')}
              </td>

              {/* Total */}
              <td className="p-4 text-right align-middle font-mono font-semibold text-slate-900">
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

              {/* Created Date */}
              <td className="p-4 text-left align-middle text-slate-500 text-xs">
                {formatDate(order.createdAt)}
              </td>

              {/* Details Action CTA */}
              <td className="p-4 text-right align-middle">
                <Link 
                  className="inline-flex items-center justify-center font-semibold text-teal-600 no-underline hover:text-teal-800 transition-colors group-hover:translate-x-0.5 transform duration-150" 
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
            <td className="p-12 text-center text-slate-400 font-medium" colSpan="7">
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-base text-slate-500">No records found</span>
                <span className="text-xs text-slate-400 font-normal">There are no active orders available in this scope.</span>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)