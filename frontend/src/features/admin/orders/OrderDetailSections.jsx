import { formatDate, formatMoney, getTitle } from '../lib/adminUtils'
import { OrderStatusControls } from './OrderStatusControls'

export const OrderDetailSections = ({ order, onUpdated }) => (
  <div className="grid gap-4 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)]">
    <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="mb-3 text-xl font-bold text-slate-950">Summary</h3>
      <p className="m-0 text-slate-700">Customer: {getTitle(order.user, 'Customer')}</p>
      <p className="m-0 text-slate-700">Total: {formatMoney(order.totalAmount ?? order.total, order.currency)}</p>
      <p className="m-0 text-slate-700">Created: {formatDate(order.createdAt)}</p>
      <OrderStatusControls order={order} onUpdated={onUpdated} />
    </section>

    <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="mb-3 text-xl font-bold text-slate-950">Items</h3>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr>
              <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Item</th>
              <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">SKU</th>
              <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Qty</th>
              <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Price</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item) => (
              <tr key={`${item.sku}-${item.name}`}>
                <td className="border-b border-slate-200 p-3 text-left align-top">{item.name || getTitle(item.watch)}</td>
                <td className="border-b border-slate-200 p-3 text-left align-top">{item.sku}</td>
                <td className="border-b border-slate-200 p-3 text-left align-top">{item.quantity}</td>
                <td className="border-b border-slate-200 p-3 text-left align-top">{formatMoney(item.price, order.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </div>
)
