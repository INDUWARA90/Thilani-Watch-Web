import { useQuery } from '@tanstack/react-query'
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
import { usePageTitle } from '@/shared/hooks/usePageTitle'
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
  usePageTitle('Admin Overview | Thilani Watch Web')

  const summaryQuery = useQuery({
    queryKey: ['admin', 'dashboard', 'summary'],
    queryFn: adminApi.getDashboardSummary,
  })
  const error = summaryQuery.error ? getApiErrorMessage(summaryQuery.error, 'Unable to load dashboard metrics.') : ''
  const isLoading = summaryQuery.isLoading
  const summary = summaryQuery.data ?? null
  const metrics = summary || {}

  return (
    <div className="mx-auto min-w-0 max-w-7xl space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-semibold text-primary ring-1 ring-inset ring-accent/20">
            Control Center
          </div>
          <h2 className="mt-2 break-words font-heading text-2xl font-bold tracking-wide text-primary sm:text-3xl">Admin Operations</h2>
          <p className="text-sm text-primary">Real-time overview of your luxury marketplace operations.</p>
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
        <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">Management Modules</h4>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {overviewCards.map((card) => {
            const CardIcon = card.icon
            return (
              <Link 
                className="group relative flex min-w-0 flex-col justify-between rounded-2xl border border-black/10 bg-[#FFFEFA] p-5 text-primary shadow-sm no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md" 
                key={card.title} 
                to={card.to}
              >
                <div>
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-black/5 bg-[#FAF9F5] text-primary transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                    <CardIcon className="h-4 w-4" />
                  </div>
                  <h3 className="mb-1 break-words font-heading text-base font-bold tracking-wide text-primary transition-colors group-hover:text-primary">{card.title}</h3>
                  <p className="text-xs leading-relaxed text-primary">{card.text}</p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-accent opacity-0 transition-all duration-200 group-hover:opacity-100">
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
  <section className="relative min-w-0 overflow-hidden rounded-2xl border border-black/10 bg-[#FFFEFA] p-5 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-center justify-between">
      <p className="text-xs font-medium uppercase tracking-wider text-primary">{label}</p>
      {Icon && (
        <div className="rounded-lg bg-[#FAF9F5] p-2 text-primary border border-black/5">
          <Icon className="h-4 w-4" />
        </div>
      )}
    </div>
    <div className="mt-2 flex min-w-0 items-baseline gap-2">
      <strong className="min-w-0 break-words text-2xl font-bold tracking-tight text-primary">{value}</strong>
    </div>
  </section>
)


