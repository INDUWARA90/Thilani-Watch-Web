import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { 
  Package, 
  FolderTree, 
  ShoppingBag, 
  MessageSquare, 
  Ticket, 
  Users, 
  ArrowUpRight, 
  AlertTriangle,
  Layers,
  DollarSign
} from 'lucide-react'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { LoadingState } from '@/shared/ui/LoadingState'
import { adminApi } from '../api/adminApi'
import { formatMoney } from '../lib/adminUtils'

const overviewCards = [
  {
    title: 'Product Management',
    text: 'Create watches, edit product data, upload images, update stock, publish, and delete.',
    to: '/admin/products',
    icon: Package,
  },
  {
    title: 'Categories & Brands',
    text: 'Maintain catalog entry points with active state, sort order, image URLs, and slugs.',
    to: '/admin/catalog',
    icon: FolderTree,
  },
  {
    title: 'Orders',
    text: 'Review customer orders, open order details, and update order or payment status.',
    to: '/admin/orders',
    icon: ShoppingBag,
  },
  {
    title: 'Reviews',
    text: 'Moderate visible reviews using the approval toggle endpoint.',
    to: '/admin/reviews',
    icon: MessageSquare,
  },
  {
    title: 'Coupons',
    text: 'Create promotions, deactivate coupons, and keep discount rules current.',
    to: '/admin/coupons',
    icon: Ticket,
  },
  {
    title: 'Customers',
    text: 'Search customers, review account status, and inspect their order history.',
    to: '/admin/customers',
    icon: Users,
  },
]

export const AdminOverviewPage = () => {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        const summaryPayload = await adminApi.getDashboardSummary()
        if (isMounted) {
          setSummary(summaryPayload || {})
          setError('')
        }
      } catch (apiError) {
        if (isMounted) {
          setError(getApiErrorMessage(apiError, 'Unable to load dashboard metrics.'))
        }
      } finally {
        if (isMounted) {
          isMounted && setIsLoading(false)
        }
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [])

  const metrics = summary || {}

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-700/10">
            Control Center
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Admin Operations</h2>
          <p className="text-sm text-slate-500">Real-time overview of your luxury marketplace operations.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50/50 p-4 text-sm font-medium text-red-800">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <LoadingState label="Loading dashboard summary" variant="cards" rows={3} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard 
            label="Total Revenue" 
            value={formatMoney(metrics.totalRevenue ?? metrics.revenue)} 
            icon={DollarSign}
          />
          <MetricCard 
            label="Orders" 
            value={metrics.totalOrders ?? metrics.ordersCount ?? 0} 
            icon={ShoppingBag}
          />
          <MetricCard 
            label="Products" 
            value={metrics.totalProducts ?? metrics.productsCount ?? 0} 
            icon={Layers}
          />
          <MetricCard 
            label="Customers" 
            value={metrics.totalCustomers ?? metrics.customersCount ?? 0} 
            icon={Users}
          />
        </div>
      )}

      <div>
        <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Management Modules</h4>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {overviewCards.map((card) => {
            const CardIcon = card.icon
            return (
              <Link 
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white p-5 text-slate-900 shadow-sm no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-500/30 hover:shadow-md" 
                key={card.title} 
                to={card.to}
              >
                <div>
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-600 transition-colors group-hover:bg-teal-50 group-hover:text-teal-600">
                    <CardIcon className="h-4 w-4" />
                  </div>
                  <h3 className="mb-1 text-base font-bold text-slate-900 transition-colors group-hover:text-teal-700">{card.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-500">{card.text}</p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-teal-600 opacity-0 transition-all duration-200 group-hover:opacity-100">
                  <span>Manage</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const MetricCard = ({ label, value, icon: Icon }) => (
  <section className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-center justify-between">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      {Icon && (
        <div className="rounded-lg bg-slate-50 p-2 text-slate-400 border border-slate-100">
          <Icon className="h-4 w-4" />
        </div>
      )}
    </div>
    <div className="mt-2 flex items-baseline gap-2">
      <strong className="text-2xl font-bold tracking-tight text-slate-900">{value}</strong>
    </div>
  </section>
)
