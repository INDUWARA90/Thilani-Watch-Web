import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { getApiErrorMessage } from '../../lib/apiClient'
import { usePageTitle } from '../../lib/usePageTitle'
import { useCommerce } from '../commerce/useCommerce'
import { formatMoney } from '../storefront/storefrontUtils'
import { normalizeOrder, SHIPPING_FEE } from './orderUtils'
import { ordersApi } from './ordersApi'

// Backend currently expects a fixed shipping fee during checkout.
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
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const discount = Number(cart.discount || cart.discountAmount || 0)
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

  return (
    <main>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-extrabold uppercase tracking-normal text-teal-700">Checkout</p>
          <h1 className="text-4xl font-bold leading-tight text-slate-950">Place Your Order</h1>
        </div>
        <Link className="font-bold text-teal-700 no-underline hover:underline" to="/cart">
          Back to cart
        </Link>
      </div>

      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}

      {isLoading ? (
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 font-bold text-emerald-950">Loading checkout...</div>
      ) : cart.items.length === 0 ? (
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-2 text-2xl font-bold text-slate-950">Your cart is empty</h2>
          <p className="mb-5 text-slate-600">Add watches before checkout.</p>
          <Link className="inline-flex min-h-11 w-fit items-center justify-center rounded-lg bg-teal-700 px-4 font-extrabold text-white no-underline hover:bg-teal-800" to="/watches">
            Browse watches
          </Link>
        </section>
      ) : (
        <form className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]" onSubmit={handleSubmit}>
          <div className="grid gap-5">
            <AddressForm address={shippingAddress} legend="Shipping Address" setAddress={setShippingAddress} updateAddress={updateAddress} />

            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <label className="flex items-center gap-3 font-bold text-slate-700">
                <input checked={useShippingAsBilling} type="checkbox" onChange={(event) => setUseShippingAsBilling(event.target.checked)} />
                Use shipping address as billing address
              </label>
            </section>

            {!useShippingAsBilling && <AddressForm address={billingAddress} legend="Billing Address" setAddress={setBillingAddress} updateAddress={updateAddress} />}

            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="mb-4 text-xl font-bold text-slate-950">Payment</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['cod', 'Cash on delivery'],
                  ['card', 'Card'],
                  ['bank_transfer', 'Bank transfer'],
                ].map(([value, label]) => (
                  <label className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 font-bold text-slate-700" key={value}>
                    <input checked={paymentMethod === value} name="paymentMethod" type="radio" value={value} onChange={(event) => setPaymentMethod(event.target.value)} />
                    {label}
                  </label>
                ))}
              </div>
            </section>

            <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-extrabold text-slate-700">
                Coupon code
                <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-extrabold text-slate-700">
                Notes
                <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" value={notes} onChange={(event) => setNotes(event.target.value)} />
              </label>
            </section>
          </div>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-xl font-bold text-slate-950">Order Summary</h2>
            <SummaryRow label="Subtotal" value={formatMoney(cart.subtotal, cart.currency || 'LKR')} />
            <SummaryRow label="Shipping" value={formatMoney(SHIPPING_FEE, cart.currency || 'LKR')} />
            <SummaryRow label="Discount" value={`-${formatMoney(discount, cart.currency || 'LKR')}`} />
            <div className="my-4 border-t border-slate-200" />
            <SummaryRow isStrong label="Total" value={formatMoney(total, cart.currency || 'LKR')} />
            <button className="mt-5 inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-teal-700 px-4 font-extrabold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-65" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Placing order...' : 'Place order'}
            </button>
          </aside>
        </form>
      )}
    </main>
  )
}

const AddressForm = ({ address, legend, setAddress, updateAddress }) => (
  <fieldset className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5">
    <legend className="px-1 text-xl font-bold text-slate-950">{legend}</legend>
    <div className="grid gap-4 sm:grid-cols-2">
      {addressFields.map(([name, label]) => (
        <label className="grid gap-2 text-sm font-extrabold text-slate-700" key={name}>
          {label}
          <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" required={name !== 'state'} value={address[name]} onChange={(event) => updateAddress(setAddress, name, event.target.value)} />
        </label>
      ))}
    </div>
  </fieldset>
)

const SummaryRow = ({ isStrong = false, label, value }) => (
  <div className="mb-3 flex items-center justify-between gap-3">
    <span className={`text-slate-600 ${isStrong ? 'text-lg font-extrabold' : 'font-bold'}`}>{label}</span>
    <strong className={isStrong ? 'text-xl text-slate-950' : 'text-slate-950'}>{value}</strong>
  </div>
)

const cleanAddress = (address) =>
  Object.fromEntries(Object.entries(address).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]))
