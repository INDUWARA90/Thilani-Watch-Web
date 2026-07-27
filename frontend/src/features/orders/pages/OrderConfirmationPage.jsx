import { ArrowRight, CheckCircle2, PackageCheck, ReceiptText, ShoppingBag } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { formatOrderMoney, getOrderId, getOrderNumber, getOrderStatus, getOrderTotal, normalizeOrder } from '@/features/orders/lib/orderUtils'

export const OrderConfirmationPage = () => {
  usePageTitle('Order Confirmation | Thilani Watch Web')

  const { id } = useParams()
  const location = useLocation()
  const order = normalizeOrder(location.state?.order || {})
  const orderId = getOrderId(order) || id
  const orderStatus = getOrderStatus(order)
  const orderNumber = getOrderNumber(order) || orderId

  return (
    <main className="min-h-[calc(100vh-120px)] bg-base px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <section className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="overflow-hidden rounded-lg border border-white/12 bg-surface shadow-glowSm">
          <div className="relative overflow-hidden bg-base px-6 py-10 text-white sm:px-10 sm:py-12">
            <div className="glow-beam absolute bottom-4 left-1/2 h-px w-[80%] -translate-x-1/2 bg-white/70 shadow-glow" />
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
              <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
            </div>
            <p className="mb-4 inline-flex min-h-10 items-center rounded-full border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white/65">
              Order placed successfully
            </p>
            <h1 className="max-w-2xl font-heading text-[40px] font-bold leading-[1.05] text-white sm:text-[54px]">
              Thank you for your order
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              Your order has been received and is now marked as {orderStatus}.
            </p>
          </div>

          <div className="grid gap-5 p-6 sm:p-8">
            <div className="grid gap-4 rounded-lg border border-white/12 bg-black/25 p-5 sm:grid-cols-3">
              <OrderMeta label="Order number" value={orderNumber || 'Not available'} />
              <OrderMeta label="Status" value={orderStatus} />
              <OrderMeta label="Total" value={formatOrderMoney(getOrderTotal(order), order.currency)} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoTile
                icon={ReceiptText}
                title="Order details"
                text="Open the full order page to review items, payment, shipping address, and updates."
              />
              <InfoTile
                icon={PackageCheck}
                title="Payment slip attached"
                text="Your bank transfer slip has been attached for admin review."
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-black no-underline shadow-lg transition hover:shadow-glow active:scale-[0.98]"
                to={`/orders/${orderId}`}
              >
                View order
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 text-sm font-bold text-white no-underline transition hover:border-white/45 hover:shadow-glowSm active:scale-[0.98]"
                to="/orders"
              >
                My orders
              </Link>
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-white/12 bg-surface p-6 shadow-glowSm">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-white/10 text-white">
            <ShoppingBag className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="font-heading text-xl font-bold text-white">What happens next</h2>
          <div className="mt-5 grid gap-4">
            <NextStep step="1" title="Order review" text="We check your order and stock details." />
            <NextStep step="2" title="Preparing package" text="Your watch is packed for delivery." />
            <NextStep step="3" title="Delivery" text="After payment review, your watch will be sent for delivery." />
          </div>
          <Link
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-black no-underline transition hover:shadow-glow active:scale-[0.98]"
            to="/watches"
          >
            Continue shopping
          </Link>
        </aside>
      </section>
    </main>
  )
}

const OrderMeta = ({ label, value }) => (
  <div className="min-w-0">
    <p className="mb-1 text-xs font-bold uppercase text-white/75">{label}</p>
    <p className="truncate text-base font-bold text-white">{value}</p>
  </div>
)

const InfoTile = ({ icon: Icon, text, title }) => (
  <article className="rounded-lg border border-white/12 bg-white/[0.04] p-5 shadow-sm">
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-black">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </div>
    <h2 className="text-base font-bold text-white">{title}</h2>
    <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
  </article>
)

const NextStep = ({ step, text, title }) => (
  <div className="flex gap-3">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
      {step}
    </span>
    <div>
      <p className="font-semibold text-white">{title}</p>
      <p className="text-sm leading-6 text-white/65">{text}</p>
    </div>
  </div>
)
