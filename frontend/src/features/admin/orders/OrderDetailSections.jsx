import { formatDate, formatMoney, getTitle } from '../lib/adminUtils'
import { OrderStatusControls } from './OrderStatusControls'

export const OrderDetailSections = ({ order, onUpdated }) => (
  <div className="grid gap-6 lg:grid-cols-[minmax(320px,1fr)_minmax(0,2fr)]">
    {/* Summary Section */}
    <section className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Summary</h3>
        <p className="text-xs text-slate-500">Overview of the order details</p>
      </div>

      <div className="grid gap-3 text-sm border-t border-slate-100 pt-4">
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-500 font-medium">Customer</span>
          <span className="font-semibold text-slate-800">{getTitle(order.user, 'Customer')}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-500 font-medium">Created</span>
          <span className="text-slate-700">{formatDate(order.createdAt)}</span>
        </div>
        <div className="flex justify-between items-center py-1 bg-slate-50 -mx-6 px-6 my-1">
          <span className="text-slate-600 font-semibold">Total Amount</span>
          <span className="text-base font-bold text-slate-950">
            {formatMoney(order.totalAmount ?? order.total, order.currency)}
          </span>
        </div>
      </div>

      <div className="mt-auto border-t border-slate-100 pt-4">
        <OrderStatusControls order={order} onUpdated={onUpdated} />
      </div>
    </section>

    {/* Items Section */}
    <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Items</h3>
        <p className="text-xs text-slate-500">Products included in this order</p>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-slate-100">
        <table className="w-full min-w-[600px] border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200">
              <th className="p-3 text-left font-semibold text-slate-600">Item</th>
              <th className="p-3 text-left font-semibold text-slate-600">SKU</th>
              <th className="p-3 text-right font-semibold text-slate-600">Qty</th>
              <th className="p-3 text-right font-semibold text-slate-600">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(order.items || []).map((item) => (
              <tr 
                key={`${item.sku}-${item.name}`} 
                className="transition-colors hover:bg-slate-50/50"
              >
                <td className="p-3 text-left font-medium text-slate-900 max-w-[240px] truncate">
                  {item.name || getTitle(item.watch)}
                </td>
                <td className="p-3 text-left font-mono text-xs text-slate-500">
                  {item.sku}
                </td>
                <td className="p-3 text-right font-mono text-slate-700">
                  {item.quantity}
                </td>
                <td className="p-3 text-right font-semibold text-slate-900">
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