import { ArrowRight, CheckCircle2, PackageCheck, ReceiptText, ShoppingBag } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { formatOrderMoney, getOrderId, getOrderNumber, getOrderStatus, getOrderTotal, normalizeOrder } from '@/features/orders/lib/orderUtils'

const OrderConfirmationPage = () => {
  usePageTitle('Order Confirmation | Thilani Watch Web')

  const { id } = useParams()
  const location = useLocation()
  const order = normalizeOrder(location.state?.order || {})
  const orderId = getOrderId(order) || id
  const orderStatus = getOrderStatus(order)
  const orderNumber = getOrderNumber(order) || orderId

  return (
    <main className="min-h-[calc(100vh-120px)] bg-base px-4 py-12 text-black sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <section className="mx-auto grid max-w-[1150px] gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        {/* Main Confirmation Card */}
        <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          {/* Header Banner */}
          <div className="relative overflow-hidden bg-gradient-to-b from-stone-100/90 via-stone-50/50 to-white px-6 py-12 text-black sm:px-10 sm:py-14 border-b border-black/5">
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <div className="absolute top-0 right-0 h-[250px] w-[250px] rounded-full bg-emerald-200/20 blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 shadow-inner">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
              </div>
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 shadow-sm">
                Order placed successfully
              </span>
              <h1 className="max-w-2xl font-heading text-[38px] font-extrabold tracking-tight leading-[1.05] text-black sm:text-[50px]">
                Thank you for your order
              </h1>
              <p className="mt-4 max-w-xl text-base font-normal leading-relaxed text-stone-600 sm:text-lg">
                Your order has been received and is currently marked as <strong className="font-semibold text-black underline decoration-amber-500/50 underline-offset-4">{orderStatus}</strong>.
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid gap-6 p-6 sm:p-10">
            {/* Meta Row */}
            <div className="grid gap-4 rounded-2xl border border-black/10 bg-stone-50/70 p-5 sm:grid-cols-3">
              <OrderMeta label="Order number" value={orderNumber || 'Not available'} isMono />
              <OrderMeta label="Status" value={orderStatus} />
              <OrderMeta label="Total Amount" value={formatOrderMoney(getOrderTotal(order), order.currency)} isMono />
            </div>

            {/* Info Tiles */}
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoTile
                icon={ReceiptText}
                title="Order details"
                text="Open the full order page to review items, payment, shipping address, and tracking updates."
              />
              <InfoTile
                icon={PackageCheck}
                title="Payment slip attached"
                text="Your bank transfer receipt has been attached securely for swift admin verification."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3.5 sm:flex-row pt-2">
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-black px-7 text-sm font-bold text-white no-underline shadow-lg shadow-black/10 transition-all duration-300 hover:bg-stone-800 hover:shadow-xl active:scale-98"
                to={`/orders/${orderId}`}
              >
                View full order
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-7 text-sm font-bold text-black no-underline transition-all duration-200 hover:bg-stone-50 hover:border-black/30 active:scale-98"
                to="/orders"
              >
                View all my orders
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar: Next Steps */}
        <aside className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] lg:sticky lg:top-28">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-black/5 text-stone-800 shadow-inner">
            <ShoppingBag className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-black border-b border-black/10 pb-4">
            What happens next
          </h2>
          
          <div className="mt-6 grid gap-5">
            <NextStep step="1" title="Order review" text="We carefully check your order items and stock details." />
            <NextStep step="2" title="Preparing package" text="Your luxury timepiece is safely packed for dispatch." />
            <NextStep step="3" title="Express delivery" text="Following payment verification, your order is sent out for delivery." />
          </div>

          <div className="mt-8 pt-6 border-t border-black/10">
            <Link
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-stone-100 px-6 text-sm font-bold text-black no-underline transition-all hover:bg-stone-200 active:scale-98"
              to="/watches"
            >
              Continue shopping
            </Link>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default OrderConfirmationPage

const OrderMeta = ({ label, value, isMono = false }) => (
  <div className="min-w-0">
    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-stone-500">{label}</p>
    <p className={`truncate text-base font-bold text-black ${isMono ? 'font-mono' : ''}`}>{value}</p>
  </div>
)

const InfoTile = ({ icon: Icon, text, title }) => (
  <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:border-black/25">
    <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-stone-800 shadow-inner">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </div>
    <h2 className="font-heading text-base font-bold tracking-tight text-black">{title}</h2>
    <p className="mt-1.5 text-xs leading-relaxed text-stone-600">{text}</p>
  </article>
)

const NextStep = ({ step, text, title }) => (
  <div className="flex gap-4 items-start">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-black text-xs font-extrabold text-white shadow-sm">
      {step}
    </span>
    <div>
      <p className="font-bold text-sm text-black tracking-tight">{title}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-stone-600">{text}</p>
    </div>
  </div>
)
