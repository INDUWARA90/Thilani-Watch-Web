import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ButtonSpinner, LoadingState } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { useCommerce } from '@/features/commerce/hooks/useCommerce'
import { formatMoney } from '@/features/storefront/lib/storefrontUtils'
import { normalizeOrder, SHIPPING_FEE } from '@/features/orders/lib/orderUtils'
import { ordersApi } from '@/features/orders/api/ordersApi'

const addressFields = [
  ['street', 'Street'],
  ['city', 'City'],
  ['state', 'State'],
  ['zip', 'ZIP / Postal code'],
  ['country', 'Country'],
  ['phone', 'Phone'],
]

const emptyAddress = {
  city: '',
  country: 'Sri Lanka',
  phone: '',
  state: '',
  street: '',
  zip: '',
}

export const CheckoutPage = () => {
  usePageTitle('Checkout | Thilani Watch Web')

  const { cart, isLoading, loadCommerce } = useCommerce()
  const navigate = useNavigate()
  const [shippingAddress, setShippingAddress] = useState(emptyAddress)
  const [billingAddress, setBillingAddress] = useState(emptyAddress)
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [couponCode, setCouponCode] = useState('')
  const [couponResult, setCouponResult] = useState(null)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const discount = Number(readCouponDiscount(couponResult) || cart.discount || cart.discountAmount || 0)
  const total = useMemo(() => Math.max(0, Number(cart.subtotal || 0) + SHIPPING_FEE - discount), [cart.subtotal, discount])

  const updateAddress = (setter, name, value) => {
    setter((current) => ({ ...current, [name]: value }))
  }

  const validateAddress = (address, label) => {
    const required = ['street', 'city', 'zip', 'country', 'phone']
    const missing = required.filter((field) => !address[field]?.trim())
    if (missing.length > 0) {
      throw new Error(`${label} is missing: ${missing.join(', ')}.`)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (cart.items.length === 0) {
        throw new Error('Your cart is empty.')
      }

      if (!['cod', 'card', 'bank_transfer'].includes(paymentMethod)) {
        throw new Error('Choose a valid payment method.')
      }

      validateAddress(shippingAddress, 'Shipping address')
      if (!useShippingAsBilling) {
        validateAddress(billingAddress, 'Billing address')
      }

      const payload = {
        paymentMethod,
        shippingAddress: cleanAddress(shippingAddress),
      }

      if (!useShippingAsBilling) {
        payload.billingAddress = cleanAddress(billingAddress)
      }

      if (couponCode.trim()) payload.couponCode = couponCode.trim()
      if (notes.trim()) payload.notes = notes.trim()

      const order = normalizeOrder(await ordersApi.createOrder(payload))
      await loadCommerce()
      navigate(`/orders/confirmation/${order?._id || order?.id || order?.orderNumber}`, { replace: true, state: { order } })
    } catch (submitError) {
      setError(submitError?.response ? getApiErrorMessage(submitError, 'Unable to place order.') : submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleValidateCoupon = async () => {
    setError('')
    setCouponMessage('')
    setCouponResult(null)

    if (!couponCode.trim()) {
      setCouponMessage('Enter a coupon code first.')
      return
    }

    setIsValidatingCoupon(true)
    try {
      const payload = await ordersApi.validateCoupon({
        code: couponCode.trim(),
        cartTotal: Number(cart.subtotal || 0),
      })
      setCouponResult(payload)
      setCouponMessage('Coupon applied.')
    } catch (apiError) {
      setCouponMessage(getApiErrorMessage(apiError, 'Coupon is not valid for this cart.'))
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  return (
    <main className="-mx-4 -mt-8 bg-white sm:-mx-6 lg:-mx-8">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F49006_0%,#EB960E_100%)] px-4 pb-28 pt-16 text-white sm:px-6 sm:pt-20 lg:px-10">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-4 inline-flex min-h-11 items-center rounded-[14px] border border-white bg-white/20 px-5 text-sm font-normal text-white">Checkout</p>
            <h1 className="text-[44px] font-extrabold leading-[1.1] text-white sm:text-[56px] lg:text-[65px] lg:leading-[71px]">Place Your Order</h1>
          </div>
          <Link className="inline-flex min-h-11 w-fit items-center justify-center rounded-[14px] bg-[#121212] px-8 text-sm font-normal text-white no-underline transition hover:bg-[#272222]" to="/cart">
            Back to cart
          </Link>
        </div>
        <svg className="absolute bottom-[-1px] left-0 h-20 w-full text-white" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0 70L60 62.7C120 55 240 41 360 49.3C480 58 600 88 720 92.7C840 98 960 77 1080 63.3C1200 50 1320 44 1380 41.3L1440 39V120H0V70Z" />
        </svg>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-10">
        {error && <div className="mb-5 border border-[#DC3545] bg-red-50 px-4 py-3 font-normal text-[#DC3545]">{error}</div>}

        {isLoading ? (
          <LoadingState label="Preparing checkout" variant="form" />
        ) : cart.items.length === 0 ? (
          <section className="border border-[#DEE2E6] bg-[#F8F9FA] p-6">
            <h2 className="mb-2 text-2xl font-bold text-[#121212]">Your cart is empty</h2>
            <p className="mb-5 text-[#212529]">Add watches before checkout.</p>
            <Link className="inline-flex min-h-11 w-fit items-center justify-center rounded-[14px] bg-[#121212] px-8 text-sm font-normal text-white no-underline hover:bg-[#272222]" to="/watches">
              Browse watches
            </Link>
          </section>
        ) : (
          <form className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]" onSubmit={handleSubmit}>
            <div className="grid gap-5">
              <AddressForm address={shippingAddress} legend="Shipping Address" setAddress={setShippingAddress} updateAddress={updateAddress} />

              <section className="border border-[#DEE2E6] bg-white p-5">
                <label className="flex min-h-11 items-center gap-3 text-base font-normal text-[#121212]">
                  <input checked={useShippingAsBilling} type="checkbox" onChange={(event) => setUseShippingAsBilling(event.target.checked)} />
                  Use shipping address as billing address
                </label>
              </section>

              {!useShippingAsBilling && <AddressForm address={billingAddress} legend="Billing Address" setAddress={setBillingAddress} updateAddress={updateAddress} />}

              <section className="border border-[#DEE2E6] bg-white p-5">
                <h2 className="mb-4 text-xl font-bold text-[#121212]">Payment</h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ['cod', 'Cash on delivery'],
                    ['card', 'Card'],
                    ['bank_transfer', 'Bank transfer'],
                  ].map(([value, label]) => (
                    <label className="flex min-h-12 items-center gap-3 border border-[#DEE2E6] bg-[#F8F9FA] px-3 text-base font-normal text-[#121212]" key={value}>
                      <input checked={paymentMethod === value} name="paymentMethod" type="radio" value={value} onChange={(event) => setPaymentMethod(event.target.value)} />
                      {label}
                    </label>
                  ))}
                </div>
              </section>

              <section className="grid gap-4 border border-[#DEE2E6] bg-white p-5 sm:grid-cols-2">
                <div className="grid gap-2 text-base font-normal text-[#121212]">
                  <label className="grid gap-2">
                    Coupon code
                    <input
                      className={inputClass}
                      value={couponCode}
                      onChange={(event) => {
                        setCouponCode(event.target.value)
                        setCouponResult(null)
                        setCouponMessage('')
                      }}
                    />
                  </label>
                  <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#121212] px-5 text-sm font-normal text-white hover:bg-[#272222] disabled:cursor-not-allowed disabled:opacity-65" disabled={isValidatingCoupon} type="button" onClick={handleValidateCoupon}>
                    {isValidatingCoupon && <ButtonSpinner />} {isValidatingCoupon ? 'Checking' : 'Validate coupon'}
                  </button>
                  {couponMessage && <p className="m-0 text-sm font-bold text-[#F49006]">{couponMessage}</p>}
                </div>
                <label className="grid gap-2 text-base font-normal text-[#121212]">
                  Notes
                  <input className={inputClass} value={notes} onChange={(event) => setNotes(event.target.value)} />
                </label>
              </section>
            </div>

            <aside className="h-fit border border-[#DEE2E6] bg-white p-5 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)]">
              <h2 className="mb-4 text-xl font-bold text-[#121212]">Order Summary</h2>
              <SummaryRow label="Subtotal" value={formatMoney(cart.subtotal, cart.currency || 'LKR')} />
              <SummaryRow label="Shipping" value={formatMoney(SHIPPING_FEE, cart.currency || 'LKR')} />
              <SummaryRow label="Discount" value={`-${formatMoney(discount, cart.currency || 'LKR')}`} />
              <div className="my-4 border-t border-[#DEE2E6]" />
              <SummaryRow isStrong label="Total" value={formatMoney(total, cart.currency || 'LKR')} />
              <button className="mt-5 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#121212] px-8 text-sm font-normal text-white hover:bg-[#272222] disabled:cursor-not-allowed disabled:opacity-65" disabled={isSubmitting} type="submit">
                {isSubmitting && <ButtonSpinner />} {isSubmitting ? 'Placing order' : 'Place order'}
              </button>
            </aside>
          </form>
        )}
      </section>
    </main>
  )
}

const inputClass = 'min-h-[45px] min-w-0 border border-[#DEE2E6] bg-white px-[15px] text-[#121212] outline-none focus:border-[#0D6EFD] focus:ring-2 focus:ring-[#0D6EFD]/25'

const AddressForm = ({ address, legend, setAddress, updateAddress }) => (
  <fieldset className="grid gap-4 border border-[#DEE2E6] bg-white p-5">
    <legend className="px-1 text-xl font-bold text-[#121212]">{legend}</legend>
    <div className="grid gap-4 sm:grid-cols-2">
      {addressFields.map(([name, label]) => (
        <label className="grid gap-2 text-base font-normal text-[#121212]" key={name}>
          {label}
          <input className={inputClass} required={name !== 'state'} value={address[name]} onChange={(event) => updateAddress(setAddress, name, event.target.value)} />
        </label>
      ))}
    </div>
  </fieldset>
)

const SummaryRow = ({ isStrong = false, label, value }) => (
  <div className="mb-3 flex items-center justify-between gap-3">
    <span className={`text-[#6C757D] ${isStrong ? 'text-lg font-bold' : 'font-normal'}`}>{label}</span>
    <strong className={isStrong ? 'text-xl text-[#121212]' : 'text-[#121212]'}>{value}</strong>
  </div>
)

const cleanAddress = (address) =>
  Object.fromEntries(Object.entries(address).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]))

const readCouponDiscount = (payload) =>
  payload?.discountAmount ??
  payload?.discount ??
  payload?.coupon?.discountAmount ??
  payload?.coupon?.discount ??
  payload?.data?.discountAmount ??
  payload?.data?.discount ??
  0
