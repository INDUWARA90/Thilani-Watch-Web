import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, PackageCheck, ReceiptText, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router'
import { LoadingState } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { canCancelOrder, formatDate, formatOrderMoney, getOrderId, getOrderStatus, getOrderTotal, getPaymentStatus, normalizeOrders } from '@/features/orders/lib/orderUtils'
import { ordersApi } from '@/features/orders/api/ordersApi'

export const MyOrdersPage = () => {
  usePageTitle('My Orders | Thilani Watch Web')

  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        const payload = await ordersApi.getMyOrders()
        if (isMounted) {
          setOrders(normalizeOrders(payload))
          setError('')
        }
      } catch (apiError) {
        if (isMounted) {
          setError(getApiErrorMessage(apiError, 'Unable to load your orders.'))
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

  return (
    <main className="-mx-4 -mt-8 bg-white sm:-mx-6 lg:-mx-8">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F49006_0%,#EB960E_100%)] px-4 pb-28 pt-16 text-white sm:px-6 sm:pt-20 lg:px-8">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <p className="mb-4 inline-flex min-h-11 items-center rounded-[14px] border border-white bg-white/20 px-5 font-[Assistant,system-ui,sans-serif] text-sm font-normal text-white">
              Account orders
            </p>
            <h1 className="max-w-3xl font-['Be_Vietnam',system-ui,sans-serif] text-[44px] font-extrabold leading-[1.1] text-white sm:text-[56px] lg:text-[65px]">
              My Orders
            </h1>
            <p className="mt-5 max-w-2xl font-['Noto_Sans',system-ui,sans-serif] text-base leading-7 text-white sm:text-lg lg:text-[22px] lg:leading-[31px]">
              Track every Thilani Watch purchase, payment update, and delivery step from one bright, simple account view.
            </p>
          </div>

          <div className="rounded-[20px] border border-white bg-white/20 p-6 text-[#212529] shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)] backdrop-blur">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#F49006]">
              <PackageCheck className="h-7 w-7" aria-hidden="true" />
            </div>
            <p className="font-['Be_Vietnam',system-ui,sans-serif] text-2xl font-bold leading-tight text-white">
              {isLoading ? 'Checking orders' : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`}
            </p>
            <p className="mt-3 font-[Assistant,system-ui,sans-serif] text-base leading-6 text-white">
              Your completed checkouts and order details stay ready here.
            </p>
            <Link
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] bg-[#121212] px-8 font-[system-ui] text-sm font-normal text-white no-underline transition hover:bg-[#272222] active:scale-[0.98]"
              to="/watches"
            >
              Continue shopping
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <WaveDivider />
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          {error && (
            <div className="mb-6 border border-[#DC3545] bg-red-50 px-4 py-3 font-[Assistant,system-ui,sans-serif] text-base font-normal text-[#121212]">
              {error}
            </div>
          )}

          {isLoading ? (
            <LoadingState label="Loading your orders" variant="reviews" rows={4} />
          ) : orders.length === 0 ? (
            <section className="grid gap-8 bg-[#F8F9FA] p-8 sm:p-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
              <div>
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F49006] text-white">
                  <ShoppingBag className="h-8 w-8" aria-hidden="true" />
                </div>
                <h2 className="mb-3 font-['Be_Vietnam',system-ui,sans-serif] text-[34px] font-bold leading-tight text-[#121212] sm:text-[42px]">
                  No orders yet
                </h2>
                <p className="max-w-2xl font-['Noto_Sans',system-ui,sans-serif] text-base leading-7 text-[#212529] sm:text-lg">
                  Your completed checkouts will appear here after you place an order.
                </p>
              </div>
              <div className="lg:text-right">
                <Link
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] bg-[#121212] px-8 font-[system-ui] text-sm font-normal text-white no-underline transition hover:bg-[#272222] active:scale-[0.98]"
                  to="/watches"
                >
                  Browse watches
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </section>
          ) : (
            <div className="grid gap-5">
              {orders.map((order) => {
                const orderStatus = getOrderStatus(order)
                const paymentStatus = getPaymentStatus(order)

                return (
                  <article
                    className="grid gap-6 border border-[#DEE2E6] bg-white p-5 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)] transition hover:shadow-[16px_18px_16px_0_rgba(0,0,0,0.1)] sm:p-6 lg:grid-cols-[minmax(0,1fr)_260px]"
                    key={getOrderId(order)}
                  >
                    <div className="grid gap-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F49006] text-white">
                          <ReceiptText className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="font-[Assistant,system-ui,sans-serif] text-sm font-normal leading-5 text-[#6C757D]">Order number</p>
                          <h2 className="font-['Be_Vietnam',system-ui,sans-serif] text-2xl font-bold leading-tight text-[#121212]">
                            {order.orderNumber || getOrderId(order)}
                          </h2>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <StatusPill label={orderStatus} tone={getStatusTone(orderStatus)} />
                        <StatusPill label={`Payment: ${paymentStatus}`} tone={getStatusTone(paymentStatus)} />
                        {canCancelOrder(order) && <StatusPill label="Cancelable" tone="warning" />}
                      </div>

                      <p className="flex items-center gap-2 font-[Assistant,system-ui,sans-serif] text-base font-normal leading-6 text-[#212529]">
                        <CalendarDays className="h-5 w-5 text-[#F49006]" aria-hidden="true" />
                        Created {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="grid content-start gap-4 lg:text-right">
                      <div>
                        <p className="font-[Assistant,system-ui,sans-serif] text-sm font-normal leading-5 text-[#6C757D]">Total</p>
                        <strong className="font-['Be_Vietnam',system-ui,sans-serif] text-2xl font-bold leading-tight text-[#121212]">
                          {formatOrderMoney(getOrderTotal(order), order.currency)}
                        </strong>
                      </div>
                      <Link
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] border border-[#DEE2E6] bg-[rgba(18,18,18,0.04)] px-8 font-[system-ui] text-sm font-normal text-[#121212] no-underline transition hover:border-[#A7A7A7] hover:bg-[rgba(18,18,18,0.08)] active:bg-[rgba(18,18,18,0.12)]"
                        to={`/orders/${getOrderId(order)}`}
                      >
                        View details
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

const WaveDivider = () => (
  <svg className="absolute bottom-[-1px] left-0 h-20 w-full text-white" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
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
  danger: 'border-[#DC3545] bg-red-50 text-[#DC3545]',
  neutral: 'border-[#DEE2E6] bg-[#F8F9FA] text-[#212529]',
  success: 'border-[#198754] bg-green-50 text-[#198754]',
  warning: 'border-[#FFC107] bg-amber-50 text-[#121212]',
}

const StatusPill = ({ label, tone = 'neutral' }) => (
  <span className={`inline-flex min-h-11 w-fit items-center rounded-full border px-4 font-[system-ui] text-sm font-normal leading-[18px] ${toneClasses[tone] || toneClasses.neutral}`}>
    {label}
  </span>
)
