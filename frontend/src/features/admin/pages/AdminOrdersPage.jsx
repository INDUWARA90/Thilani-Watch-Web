import { Link, useParams } from 'react-router'
import { LoadingState } from '@/shared/ui/LoadingState'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { getId } from '../lib/adminUtils'
import { useAdminOrderDetail, useAdminOrders } from '../hooks/useAdminOrders'
import { OrderDetailSections } from '../orders/OrderDetailSections'
import { OrdersTable } from '../orders/OrdersTable'

const getOrderStatusGroup = (status) => {
  const normalizedStatus = String(status || '').toLowerCase()

  if (normalizedStatus === 'delivered') return 'delivered'
  if (['canceled', 'cancelled'].includes(normalizedStatus)) return 'canceled'

  return 'pending'
}

const orderSections = [
  {
    key: 'pending',
    title: 'Pending Orders',
    description: 'Orders still waiting to be completed.',
    emptyMessage: 'There are no pending orders right now.',
  },
  {
    key: 'canceled',
    title: 'Canceled Orders',
    description: 'Orders that were canceled before delivery.',
    emptyMessage: 'There are no canceled orders right now.',
  },
  {
    key: 'delivered',
    title: 'Delivered Orders',
    description: 'Orders already completed and delivered.',
    emptyMessage: 'There are no delivered orders right now.',
  },
]

export const AdminOrdersPage = () => {
  usePageTitle('Admin Orders | Thilani Watch Web')

  const { error, isLoading, orders } = useAdminOrders()
  const groupedOrders = orderSections.reduce((groups, section) => {
    groups[section.key] = []
    return groups
  }, {})

  orders.forEach((order) => {
    groupedOrders[getOrderStatusGroup(order.orderStatus)].push(order)
  })

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-primary">
            Overview
          </span>
          <h1 className="font-heading text-2xl font-bold tracking-wide text-primary sm:text-3xl">
            Customer Orders
          </h1>
        </div>
      </div>

      {/* Error Callout */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-sm font-medium text-rose-800 shadow-sm">
          {error}
        </div>
      )}

      {/* Content Area */}
      {isLoading ? (
        <div className="rounded-xl border border-black/10 bg-[#FFFEFA] p-6 shadow-sm">
          <LoadingState label="Loading customer orders..." variant="table" rows={6} />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {orderSections.map((section) => {
            const sectionOrders = groupedOrders[section.key]

            return (
              <section className="flex flex-col gap-3" key={section.key}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="font-heading text-lg font-bold tracking-wide text-primary">
                      {section.title}
                    </h2>
                    <p className="text-xs font-medium text-primary/70">
                      {section.description}
                    </p>
                  </div>
                  <span className="inline-flex w-fit items-center rounded-full border border-black/10 bg-[#FFFEFA] px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                    {sectionOrders.length} {sectionOrders.length === 1 ? 'order' : 'orders'}
                  </span>
                </div>
                <OrdersTable
                  emptyMessage={section.emptyMessage}
                  emptyTitle={`No ${section.title.toLowerCase()}`}
                  orders={sectionOrders}
                />
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const AdminOrderDetailPage = () => {
  const { id } = useParams()
  const { error, isLoading, loadOrder, order } = useAdminOrderDetail(id)
  const orderLabel = order?.orderNumber || (order ? getId(order).slice(-8).toUpperCase() : id)

  usePageTitle(orderLabel ? `Admin Order #${orderLabel} | Thilani Watch Web` : 'Admin Order Details | Thilani Watch Web')

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <LoadingState label="Loading order profile..." variant="form" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Navigation Breadcrumb / Flow Control */}
      <div>
        <Link 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-accent group" 
          to="/admin/orders"
        >
          <span className="transform transition-transform group-hover:-translate-x-0.5">←</span> 
          Back to Orders
        </Link>
      </div>

      {/* Error Callout */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-sm font-medium text-rose-800 shadow-sm">
          {error}
        </div>
      )}

      {/* Order Context & Header */}
      {order && (
        <>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-wider uppercase text-primary">
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


