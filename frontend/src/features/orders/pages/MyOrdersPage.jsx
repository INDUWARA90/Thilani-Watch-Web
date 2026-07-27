import { ArrowRight, CalendarDays, PackageCheck, ReceiptText, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router'
import { LoadingState } from '@/shared/ui/LoadingState'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { canCancelOrder, formatDate, formatOrderMoney, getOrderId, getOrderNumber, getOrderStatus, getOrderTotal, getPaymentStatus } from '@/features/orders/lib/orderUtils'
import { useOrdersList } from '@/features/orders/hooks/useOrdersList'

export const MyOrdersPage = () => {
  usePageTitle('My Orders | Thilani Watch Web')

  const { error, isLoading, orders } = useOrdersList()

  return (
    <main className="bg-base text-white">
      <section className="relative overflow-hidden bg-base px-4 pb-28 pt-20 text-white sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto grid max-w-[1200px] min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="min-w-0">
            <p className="mb-4 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase text-white/75 backdrop-blur-sm">
              Account orders
            </p>
            <h1 className="max-w-3xl break-words font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              My Orders
            </h1>
            <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-white/75 sm:text-base">
              Track every Thilani Watch purchase, payment update, and delivery step from one bright, simple account view.
            </p>
          </div>

          <div className="min-w-0 rounded-lg border border-white/12 bg-surface p-5 text-white shadow-glowSm backdrop-blur-md sm:p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white text-black shadow-sm">
              <PackageCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="font-heading text-2xl font-bold tracking-tight">
              {isLoading ? 'Checking orders' : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`}
            </p>
            <p className="mt-1 text-xs font-medium text-white/65">
              Your completed checkouts and order details stay ready here.
            </p>
            <Link
              className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-white px-4 text-xs font-bold text-black no-underline shadow-md transition hover:scale-[1.01] hover:shadow-glowSm active:scale-[0.99]"
              to="/watches"
            >
              Continue shopping
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <GlowDivider />
      </section>

      <section className="relative z-10 mx-auto max-w-[1200px] min-w-0 px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm font-medium text-red-200 shadow-sm">
            <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-lg border border-white/12 bg-surface p-12 shadow-glowSm">
            <LoadingState label="Loading your orders" variant="reviews" rows={4} />
          </div>
        ) : orders.length === 0 ? (
          <section className="mx-auto max-w-2xl rounded-lg border border-white/12 bg-surface p-10 text-center shadow-glowSm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white shadow-inner">
              <ShoppingBag className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mb-2 font-heading text-2xl font-bold tracking-tight text-white">
              No orders yet
            </h2>
            <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-white/65">
              Your completed checkouts will appear here after you place an order.
            </p>
            <Link
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-black no-underline shadow-lg transition hover:scale-[1.02] hover:shadow-glow active:scale-[0.98]"
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
                  className="group grid min-w-0 gap-6 rounded-lg border border-white/12 bg-surface p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition duration-200 hover:border-white/30 hover:shadow-glowSm sm:p-6 lg:grid-cols-[minmax(0,1fr)_260px]"
                  key={getOrderId(order)}
                >
                  <div className="grid gap-4">
                    <div className="flex min-w-0 flex-wrap items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-white transition group-hover:bg-white group-hover:text-black">
                        <ReceiptText className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase text-white/75">Order number</p>
                        <h2 className="break-words font-heading text-xl font-bold tracking-tight text-white">
                          {getOrderNumber(order) || getOrderId(order)}
                        </h2>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <StatusPill label={orderStatus} tone={getStatusTone(orderStatus)} />
                      <StatusPill label={`Payment: ${paymentStatus}`} tone={getStatusTone(paymentStatus)} />
                      {canCancelOrder(order) && <StatusPill label="Cancelable" tone="warning" />}
                    </div>

                    <p className="flex items-center gap-2 text-xs font-medium text-white/65">
                      <CalendarDays className="h-4 w-4 text-white/70" aria-hidden="true" />
                      Created {formatDate(order.createdAt)}
                    </p>
                    {order.wantedDate && (
                      <p className="flex items-center gap-2 text-xs font-medium text-white/65">
                        <CalendarDays className="h-4 w-4 text-white/70" aria-hidden="true" />
                        Wanted {formatDate(order.wantedDate)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col justify-between gap-4 lg:items-end lg:text-right">
                    <div>
                      <p className="text-xs font-semibold uppercase text-white/75">Total amount</p>
                      <strong className="break-words font-heading text-2xl font-bold tracking-tight text-white">
                        {formatOrderMoney(getOrderTotal(order), order.currency)}
                      </strong>
                    </div>
                    <Link
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 text-xs font-bold text-white no-underline transition hover:border-white/45 hover:shadow-glowSm"
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

const GlowDivider = () => (
  <div className="pointer-events-none absolute bottom-8 left-1/2 h-24 w-[min(980px,92vw)] -translate-x-1/2" aria-hidden="true">
    <div className="glow-beam absolute left-0 top-1/2 h-px w-full bg-white/70 shadow-glow" />
    <div className="glow-beam absolute left-1/2 top-4 h-28 w-[80%] -translate-x-1/2 rounded-[50%] border-t border-white/45" />
  </div>
)

const getStatusTone = (value) => {
  const normalized = String(value || '').toLowerCase()

  if (['paid', 'delivered', 'completed', 'success'].includes(normalized)) return 'success'
  if (['cancelled', 'canceled', 'failed', 'rejected', 'refunded'].includes(normalized)) return 'danger'
  if (['pending', 'confirmed', 'processing', 'shipped'].includes(normalized)) return 'warning'
  return 'neutral'
}

const toneClasses = {
  danger: 'border-red-400/25 bg-red-500/10 text-red-200',
  neutral: 'border-white/12 bg-white/5 text-white/70',
  success: 'border-emerald-300/25 bg-emerald-500/10 text-emerald-200',
  warning: 'border-white/20 bg-white/10 text-white',
}

const StatusPill = ({ label, tone = 'neutral' }) => (
  <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize tracking-wide ${toneClasses[tone] || toneClasses.neutral}`}>
    {label}
  </span>
)
