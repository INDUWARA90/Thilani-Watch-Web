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
    <main className="-mx-4 -mt-8 bg-white sm:-mx-6 lg:-mx-8">
      {/* Top Profile Banner Section */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F49006_0%,#EB960E_100%)] px-4 pb-32 pt-20 text-white sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <p className="mb-3 inline-flex items-center rounded-full border border-white/35 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-white backdrop-blur-sm">
              Account orders
            </p>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              My Orders
            </h1>
            <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-white/90 sm:text-base">
              Track every Thilani Watch purchase, payment update, and delivery step from one bright, simple account view.
            </p>
          </div>

          {/* Quick Counter Summary Card */}
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-white shadow-xl backdrop-blur-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#F49006] shadow-sm">
              <PackageCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="text-2xl font-black tracking-tight">
              {isLoading ? 'Checking orders' : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`}
            </p>
            <p className="mt-1 text-xs text-white/80 font-medium">
              Your completed checkouts and order details stay ready here.
            </p>
            <Link
              className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white no-underline shadow-md transition-all duration-200 hover:bg-slate-800 hover:scale-[1.01] active:scale-[0.99]"
              to="/watches"
            >
              Continue shopping
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <WaveDivider />
      </section>

      {/* Orders Dynamic List Area */}
      <section className="relative z-10 mx-auto -mt-10 max-w-[1200px] px-4 pb-24 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 flex items-center gap-2 shadow-sm">
            <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 shadow-sm">
            <LoadingState label="Loading your orders" variant="reviews" rows={4} />
          </div>
        ) : orders.length === 0 ? (
          /* Styled Blank State Dashboard */
          <section className="rounded-2xl border border-slate-150 bg-white p-10 text-center max-w-2xl mx-auto shadow-md">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500 shadow-inner">
              <ShoppingBag className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-slate-800 tracking-tight">
              No orders yet
            </h2>
            <p className="mb-6 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              Your completed checkouts will appear here after you place an order.
            </p>
            <Link
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F49006] to-[#EB960E] px-8 text-sm font-semibold text-white no-underline shadow-lg shadow-orange-500/10 transition-all duration-200 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
              to="/watches"
            >
              Browse watches
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>
        ) : (
          /* List View Shell */
          <div className="grid gap-4">
            {orders.map((order) => {
              const orderStatus = getOrderStatus(order)
              const paymentStatus = getPaymentStatus(order)

              return (
                <article
                  className="group grid gap-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-slate-200/60 sm:p-6 lg:grid-cols-[minmax(0,1fr)_260px]"
                  key={getOrderId(order)}
                >
                  <div className="grid gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#F49006] transition-colors group-hover:bg-orange-100">
                        <ReceiptText className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Order number</p>
                        <h2 className="text-xl font-bold tracking-tight text-slate-800">
                          {getOrderNumber(order) || getOrderId(order)}
                        </h2>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <StatusPill label={orderStatus} tone={getStatusTone(orderStatus)} />
                      <StatusPill label={`Payment: ${paymentStatus}`} tone={getStatusTone(paymentStatus)} />
                      {canCancelOrder(order) && <StatusPill label="Cancelable" tone="warning" />}
                    </div>

                    <p className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <CalendarDays className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      Created {formatDate(order.createdAt)}
                    </p>
                    {order.wantedDate && (
                      <p className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <CalendarDays className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        Wanted {formatDate(order.wantedDate)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col justify-between gap-4 lg:items-end lg:text-right">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total amount</p>
                      <strong className="text-2xl font-black text-slate-800 tracking-tight">
                        {formatOrderMoney(getOrderTotal(order), order.currency)}
                      </strong>
                    </div>
                    <Link
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-5 text-xs font-semibold text-slate-700 no-underline transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 group-hover:border-slate-300"
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

const WaveDivider = () => (
  <svg className="absolute bottom-[-1px] left-0 h-16 w-full text-slate-50" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
    <path
      fill="currentColor"
      d="M0 70L60 62.7C120 55 240 41 360 49.3C480 58 600 88 720 92.7C840 98 960 77 1080 63.3C1200 50 1320 44 1380 41.3L1440 39V120H0V70Z"
    />
  </svg>
)

const getStatusTone = (value) => {
  const normalized = String(value || '').toLowerCase()

  if (['paid', 'delivered', 'completed', 'success'].includes(normalized)) return 'success'
  if (['cancelled', 'canceled', 'failed', 'rejected', 'refunded'].includes(normalized)) return 'danger'
  if (['pending', 'confirmed', 'processing', 'shipped'].includes(normalized)) return 'warning'
  return 'neutral'
}

const toneClasses = {
  danger: 'border-red-100 bg-red-50 text-red-700',
  neutral: 'border-slate-100 bg-slate-50 text-slate-600',
  success: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200/80 bg-amber-50 text-amber-800',
}

const StatusPill = ({ label, tone = 'neutral' }) => (
  <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize tracking-wide ${toneClasses[tone] || toneClasses.neutral}`}>
    {label}
  </span>
)
