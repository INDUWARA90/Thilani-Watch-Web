import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { LoadingState } from '@/shared/ui/LoadingState'
import { adminApi } from '../api/adminApi'
import { formatMoney, getTitle } from '../lib/adminUtils'

const overviewCards = [
  {
    title: 'Product Management',
    text: 'Create watches, edit product data, upload images, update stock, publish, and delete.',
    to: '/admin/products',
  },
  {
    title: 'Categories & Brands',
    text: 'Maintain catalog entry points with active state, sort order, image URLs, and slugs.',
    to: '/admin/catalog',
  },
  {
    title: 'Orders',
    text: 'Review customer orders, open order details, and update order or payment status.',
    to: '/admin/orders',
  },
  {
    title: 'Reviews',
    text: 'Moderate visible reviews using the approval toggle endpoint.',
    to: '/admin/reviews',
  },
  {
    title: 'Coupons',
    text: 'Create promotions, deactivate coupons, and keep discount rules current.',
    to: '/admin/coupons',
  },
  {
    title: 'Customers',
    text: 'Search customers, review account status, and inspect their order history.',
    to: '/admin/customers',
  },
]

export const AdminOverviewPage = () => {
  const [dashboard, setDashboard] = useState({ lowStock: [], sales: null, summary: null })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        const [summary, sales, lowStock] = await Promise.all([
          adminApi.getDashboardSummary(),
          adminApi.getDashboardSales(30),
          adminApi.getLowStockWatches(5),
        ])
        if (isMounted) {
          setDashboard({ lowStock, sales, summary })
          setError('')
        }
      } catch (apiError) {
        if (isMounted) {
          setError(getApiErrorMessage(apiError, 'Unable to load dashboard metrics.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [])

  const summary = dashboard.summary || {}
  const salesRows = normalizeSalesRows(dashboard.sales)

  return (
    <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(28,41,56,0.06)] sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-teal-700">Dashboard</p>
          <h2 className="m-0 text-3xl font-bold leading-tight text-slate-950">Admin operations</h2>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}

      {isLoading ? (
        <LoadingState label="Loading dashboard metrics" variant="table" rows={4} />
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-4">
            <MetricCard label="Revenue" value={formatMoney(summary.totalRevenue ?? summary.revenue)} />
            <MetricCard label="Orders" value={summary.totalOrders ?? summary.ordersCount ?? countStatusBreakdown(summary.orderStatusBreakdown)} />
            <MetricCard label="Products" value={summary.totalProducts ?? summary.productsCount ?? 0} />
            <MetricCard label="Customers" value={summary.totalCustomers ?? summary.customersCount ?? 0} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h3 className="mb-3 text-xl font-bold text-slate-950">Recent sales</h3>
              <div className="grid gap-2">
                {salesRows.slice(0, 5).map((row) => (
                  <div className="flex items-center justify-between gap-3 border-b border-slate-200 py-2 text-sm" key={row.date}>
                    <span className="font-bold text-slate-700">{row.date}</span>
                    <span className="text-slate-600">{row.orderCount ?? row.orders ?? 0} orders</span>
                    <strong className="text-slate-950">{formatMoney(row.revenue ?? row.totalRevenue)}</strong>
                  </div>
                ))}
                {salesRows.length === 0 && <p className="m-0 text-slate-600">No paid-order sales data yet.</p>}
              </div>
            </section>

            <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
              <h3 className="mb-3 text-xl font-bold text-slate-950">Low stock</h3>
              <div className="grid gap-2">
                {dashboard.lowStock.slice(0, 5).map((watch) => (
                  <div className="flex items-center justify-between gap-3 border-b border-amber-200 py-2 text-sm" key={watch._id || watch.id || watch.sku}>
                    <span className="font-bold text-slate-800">{getTitle(watch)}</span>
                    <strong className="text-amber-900">{watch.stockQuantity ?? watch.stock ?? 0} left</strong>
                  </div>
                ))}
                {dashboard.lowStock.length === 0 && <p className="m-0 text-slate-600">No low-stock watches found.</p>}
              </div>
            </section>
          </div>
        </>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {overviewCards.map((card) => (
          <Link className="block rounded-lg border border-slate-200 bg-slate-50 p-5 text-slate-950 no-underline hover:border-teal-200 hover:bg-teal-50" key={card.title} to={card.to}>
            <h3 className="mb-3 text-xl font-bold text-slate-950">{card.title}</h3>
            <p className="m-0 text-slate-600">{card.text}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

const MetricCard = ({ label, value }) => (
  <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
    <p className="mb-2 text-xs font-extrabold uppercase text-slate-500">{label}</p>
    <strong className="text-2xl text-slate-950">{value}</strong>
  </section>
)

const normalizeSalesRows = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.sales)) return payload.sales
  if (Array.isArray(payload?.dailySales)) return payload.dailySales
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

const countStatusBreakdown = (breakdown) => {
  if (Array.isArray(breakdown)) {
    return breakdown.reduce((total, item) => total + Number(item.count || item.total || 0), 0)
  }

  if (breakdown && typeof breakdown === 'object') {
    return Object.values(breakdown).reduce((total, value) => total + Number(value || 0), 0)
  }

  return 0
}
