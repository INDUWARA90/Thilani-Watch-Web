import { ArrowRight, CheckCircle2, PackageCheck, ReceiptText, ShoppingBag } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { formatOrderMoney, getOrderId, getOrderStatus, getOrderTotal, normalizeOrder } from '@/features/orders/lib/orderUtils'

export const OrderConfirmationPage = () => {
  usePageTitle('Order Confirmation | Thilani Watch Web')

  const { id } = useParams()
  const location = useLocation()
  const order = normalizeOrder(location.state?.order || {})
  const orderId = getOrderId(order) || id
  const orderStatus = getOrderStatus(order)
  const orderNumber = order.orderNumber || orderId

  return (
    <main className="-mx-4 -mt-22 min-h-[calc(100vh-120px)] bg-white px-4 py-12 sm:-mx-6 sm:px-6 sm:py-16 lg:-mx-8 lg:px-10 lg:py-20">
      <section className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="bg-[linear-gradient(135deg,#F49006_0%,#EB960E_100%)] px-6 py-10 text-white sm:px-10 sm:py-12">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30">
              <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
            </div>
            <p className="mb-4 inline-flex min-h-10 items-center rounded-full border border-white/50 bg-white/20 px-4 text-sm font-semibold text-white">
              Order placed successfully
            </p>
            <h1 className="max-w-2xl text-[40px] font-extrabold leading-[1.05] text-white sm:text-[54px]">
              Thank you for your order
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
              Your order has been received and is now marked as {orderStatus}.
            </p>
          </div>

          <div className="grid gap-5 p-6 sm:p-8">
            <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:grid-cols-3">
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
                title="Cash on delivery"
                text="Your payment can be completed when the order is delivered."
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white no-underline shadow-lg shadow-slate-900/10 transition hover:bg-[#F49006] active:scale-[0.98]"
                to={`/orders/${orderId}`}
              >
                View order
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-800 no-underline transition hover:border-[#F49006] hover:text-[#F49006] active:scale-[0.98]"
                to="/orders"
              >
                My orders
              </Link>
            </div>
          </div>
        </div>

        <aside className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#F49006]">
            <ShoppingBag className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">What happens next</h2>
          <div className="mt-5 grid gap-4">
            <NextStep step="1" title="Order review" text="We check your order and stock details." />
            <NextStep step="2" title="Preparing package" text="Your watch is packed for delivery." />
            <NextStep step="3" title="Delivery" text="You pay by cash when it arrives." />
          </div>
          <Link
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#F49006] px-5 text-sm font-semibold text-white no-underline transition hover:bg-[#EB960E] active:scale-[0.98]"
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
    <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
    <p className="truncate text-base font-bold text-slate-900">{value}</p>
  </div>
)

const InfoTile = ({ icon: Icon, text, title }) => (
  <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </div>
    <h2 className="text-base font-bold text-slate-900">{title}</h2>
    <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
  </article>
)

const NextStep = ({ step, text, title }) => (
  <div className="flex gap-3">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-[#F49006]">
      {step}
    </span>
    <div>
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="text-sm leading-6 text-slate-500">{text}</p>
    </div>
  </div>
)
