import { Link } from 'react-router'
import { formatDate, formatMoney, getId, getTitle } from '../adminUtils'

export const OrdersTable = ({ orders }) => (
  <div className="w-full overflow-x-auto">
    <table className="w-full min-w-[760px] border-collapse">
      <thead>
        <tr>
          <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Order</th>
          <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Customer</th>
          <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Total</th>
          <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Status</th>
          <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Payment</th>
          <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Created</th>
          <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600"></th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={getId(order)}>
            <td className="border-b border-slate-200 p-3 text-left align-top">{order.orderNumber || getId(order)}</td>
            <td className="border-b border-slate-200 p-3 text-left align-top">{getTitle(order.user, 'Customer')}</td>
            <td className="border-b border-slate-200 p-3 text-left align-top">{formatMoney(order.totalAmount ?? order.total, order.currency)}</td>
            <td className="border-b border-slate-200 p-3 text-left align-top">{order.orderStatus}</td>
            <td className="border-b border-slate-200 p-3 text-left align-top">{order.paymentStatus}</td>
            <td className="border-b border-slate-200 p-3 text-left align-top">{formatDate(order.createdAt)}</td>
            <td className="border-b border-slate-200 p-3 text-left align-top">
              <Link className="font-bold text-teal-700 no-underline hover:underline" to={`/admin/orders/${getId(order)}`}>
                Details
              </Link>
            </td>
          </tr>
        ))}
        {orders.length === 0 && (
          <tr>
            <td className="border-b border-slate-200 p-3 text-left align-top" colSpan="7">
              No orders found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)
