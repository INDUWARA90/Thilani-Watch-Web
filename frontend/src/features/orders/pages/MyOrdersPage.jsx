import { ArrowRight, CalendarDays, PackageCheck, ReceiptText, ShoppingBag, Clock, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router'
import { LoadingState } from '@/shared/ui/LoadingState'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { canCancelOrder, formatDate, formatOrderMoney, getOrderId, getOrderNumber, getOrderStatus, getOrderTotal, getPaymentStatus } from '@/features/orders/lib/orderUtils'
import { useOrdersList } from '@/features/orders/hooks/useOrdersList'

export const MyOrdersPage = () => {
  usePageTitle('My Orders | Thilani Watch Web')

  const { error, isLoading, orders } = useOrdersList()

  return (
    <main className="min-h-screen bg-[#FBFBFA] font-sans text-neutral-900">
      {/* Header Section matching light UI card style */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-[#FBFBFA] px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Column - Main Branding & Text */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-600 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-neutral-900" aria-hidden="true" />
                <span>Verified Account Dashboard</span>
              </div>

              <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl xl:text-6xl">
                My Purchases
              </h1>

              <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-neutral-600">
                View order status, download invoice details, and follow your luxury watch shipments from purchase to delivery.
              </p>

              {/* Action Buttons Group */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-black px-8 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-neutral-800 active:scale-[0.98]"
                  to="/watches"
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  Explore Watches
                </Link>
              </div>
            </div>

            {/* Right Column - Highlight Stat Banner */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-900 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Order Activity</span>
                    <h3 className="mt-1 font-heading text-3xl font-black text-neutral-900">
                      {isLoading ? '...' : orders.length}
                    </h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-neutral-900 shadow-inner">
                    <PackageCheck className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4 text-xs">
                  <div>
                    <span className="block text-[10px] font-semibold uppercase text-neutral-400">Status</span>
                    <span className="font-semibold text-emerald-600">Active Account</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold uppercase text-neutral-400">Support</span>
                    <span className="font-semibold text-neutral-900">24/7 Priority</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Orders List Section */}
      <section id="orders-list" className="relative z-10 mx-auto max-w-[1200px] min-w-0 px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700 shadow-sm">
            <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-12 shadow-sm">
            <LoadingState label="Loading your orders" variant="reviews" rows={4} />
          </div>
        ) : orders.length === 0 ? (
          <section className="mx-auto max-w-2xl rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-500 shadow-inner">
              <ShoppingBag className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mb-2 font-heading text-2xl font-bold tracking-tight text-neutral-900">
              No orders yet
            </h2>
            <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-neutral-500">
              Your completed checkouts will appear here after you place an order.
            </p>
            <Link
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-black px-8 text-sm font-bold text-white no-underline shadow-md transition hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98]"
              to="/watches"
            >
              Browse watches
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => {
              const orderStatus = getOrderStatus(order)
              const paymentStatus = getPaymentStatus(order)

              return (
                <article
                  className="group grid min-w-0 gap-6 rounded-2xl border border-neutral-200 bg-white p-5 text-neutral-900 shadow-sm transition duration-200 hover:border-neutral-300 hover:shadow-md sm:p-6 lg:grid-cols-[minmax(0,1fr)_260px]"
                  key={getOrderId(order)}
                >
                  <div className="grid gap-4">
                    <div className="flex min-w-0 flex-wrap items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 font-bold shadow-sm transition">
                        <ReceiptText className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Order number</p>
                        <h2 className="break-words font-heading text-xl font-bold tracking-tight text-neutral-900">
                          {getOrderNumber(order) || getOrderId(order)}
                        </h2>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <StatusPill label={orderStatus} tone={getStatusTone(orderStatus)} />
                      <StatusPill label={`Payment: ${paymentStatus}`} tone={getStatusTone(paymentStatus)} />
                      {canCancelOrder(order) && <StatusPill label="Cancelable" tone="warning" />}
                    </div>

                    <p className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
                      <CalendarDays className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                      Created {formatDate(order.createdAt)}
                    </p>
                    {order.wantedDate && (
                      <p className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
                        <Clock className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                        Wanted {formatDate(order.wantedDate)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col justify-between gap-4 border-t border-neutral-100 pt-4 lg:border-t-0 lg:pt-0 lg:items-end lg:text-right">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total amount</p>
                      <strong className="break-words font-heading text-2xl font-bold tracking-tight text-neutral-900">
                        {formatOrderMoney(getOrderTotal(order), order.currency)}
                      </strong>
                    </div>
                    <Link
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-black px-5 text-xs font-bold text-white no-underline transition hover:bg-neutral-800"
                      to={`/orders/${getOrderId(order)}`}
                    >
                      View details
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

const getStatusTone = (value) => {
  const normalized = String(value || '').toLowerCase()

  if (['paid', 'delivered', 'completed', 'success'].includes(normalized)) return 'success'
  if (['cancelled', 'canceled', 'failed', 'rejected', 'refunded'].includes(normalized)) return 'danger'
  if (['pending', 'confirmed', 'processing', 'shipped'].includes(normalized)) return 'warning'
  return 'neutral'
}

const toneClasses = {
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
  neutral: 'border-neutral-200 bg-neutral-50 text-neutral-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
}

const StatusPill = ({ label, tone = 'neutral' }) => (
  <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize tracking-wide ${toneClasses[tone] || toneClasses.neutral}`}>
    {label}
  </span>
)