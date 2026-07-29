import { Link, useParams } from 'react-router'
import { LoadingState } from '@/shared/ui/LoadingState'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { getId } from '../lib/adminUtils'
import { useAdminOrderDetail } from '../hooks/useAdminOrders'
import { OrderDetailSections } from '../orders/OrderDetailSections'

const AdminOrderDetailPage = () => {
  const { id } = useParams()
  const { error, isLoading, loadOrder, order } = useAdminOrderDetail(id)
  const orderLabel = order?.orderNumber || (order ? getId(order).slice(-8).toUpperCase() : id)

  usePageTitle(orderLabel ? `Admin Order #${orderLabel} | Thilani Watch Web` : 'Admin Order Details | Thilani Watch Web')

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <LoadingState label="Loading order profile..." variant="form" />
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <Link
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-accent"
          to="/admin/orders"
        >
          Back to Orders
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-sm font-medium text-rose-800 shadow-sm">
          {error}
        </div>
      )}

      {order && (
        <>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Order Profile
            </span>
            <h1 className="font-heading text-2xl font-bold tracking-wide text-primary sm:text-3xl">
              #{order.orderNumber || getId(order).slice(-8).toUpperCase()}
            </h1>
          </div>

          <OrderDetailSections order={order} onUpdated={loadOrder} />
        </>
      )}
    </div>
  )
}

export default AdminOrderDetailPage
