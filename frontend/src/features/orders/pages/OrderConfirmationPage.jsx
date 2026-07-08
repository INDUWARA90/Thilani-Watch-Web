import { Link, useLocation, useParams } from 'react-router'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { getOrderId, getOrderStatus, normalizeOrder } from '@/features/orders/lib/orderUtils'

export const OrderConfirmationPage = () => {
  usePageTitle('Order Confirmation | Thilani Watch Web')

  const { id } = useParams()
  const location = useLocation()
  const order = normalizeOrder(location.state?.order || {})
  const orderId = getOrderId(order) || id

  return (
    <main className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-6 text-center shadow-[0_18px_60px_rgba(28,41,56,0.08)] sm:p-8">
      <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-teal-700">Order placed</p>
      <h1 className="mb-4 text-4xl font-bold leading-tight text-slate-950">Thank you for your order</h1>
      <p className="mb-6 text-lg text-slate-600">
        Your order {order.orderNumber || orderId} is {getOrderStatus(order)}.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link className="inline-flex min-h-11 items-center justify-center rounded-lg bg-teal-700 px-4 font-extrabold text-white no-underline hover:bg-teal-800" to={`/orders/${orderId}`}>
          View order
        </Link>
        <Link className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 font-extrabold text-slate-950 no-underline hover:bg-slate-50" to="/orders">
          My orders
        </Link>
      </div>
    </main>
  )
}
