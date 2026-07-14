import { CheckCircle2 } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { getOrderId, getOrderStatus, normalizeOrder } from '@/features/orders/lib/orderUtils'

export const OrderConfirmationPage = () => {
  usePageTitle('Order Confirmation | Thilani Watch Web')

  const { id } = useParams()
  const location = useLocation()
  const order = normalizeOrder(location.state?.order || {})
  const orderId = getOrderId(order) || id

  return (
    <main className="-mx-4 -mt-8 bg-white sm:-mx-6 lg:-mx-8">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F49006_0%,#EB960E_100%)] px-4 pb-28 pt-16 text-center text-white sm:px-6 sm:pt-20 lg:px-10">
        <div className="mx-auto max-w-2xl">
          <CheckCircle2 className="mx-auto mb-5 h-16 w-16 text-white" />
          <p className="mb-4 inline-flex min-h-11 items-center rounded-[14px] border border-white bg-white/20 px-5 text-sm font-normal text-white">Order placed</p>
          <h1 className="text-[44px] font-extrabold leading-[1.1] text-white sm:text-[56px]">Thank you for your order</h1>
          <p className="mt-5 text-base leading-7 text-white sm:text-lg">
            Your order {order.orderNumber || orderId} is {getOrderStatus(order)}.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[#121212] px-8 text-sm font-normal text-white no-underline hover:bg-[#272222]" to={`/orders/${orderId}`}>
              View order
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-[14px] border border-white bg-white/20 px-8 text-sm font-normal text-white no-underline hover:bg-white hover:text-[#121212]" to="/orders">
              My orders
            </Link>
          </div>
        </div>
        <svg className="absolute bottom-[-1px] left-0 h-20 w-full text-white" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0 70L60 62.7C120 55 240 41 360 49.3C480 58 600 88 720 92.7C840 98 960 77 1080 63.3C1200 50 1320 44 1380 41.3L1440 39V120H0V70Z" />
        </svg>
      </section>
    </main>
  )
}
