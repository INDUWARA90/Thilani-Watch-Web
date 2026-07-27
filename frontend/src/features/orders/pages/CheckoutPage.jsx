import { Link } from 'react-router'
import { AlertCircle, CalendarDays, FileText, ImagePlus, Trash2, Upload } from 'lucide-react'
import { ButtonSpinner, LoadingState } from '@/shared/ui/LoadingState'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { formatMoney } from '@/features/storefront/lib/storefrontUtils'
import { SRI_LANKA_PROVINCES } from '@/features/orders/lib/orderUtils'
import { useCheckoutPage } from '@/features/orders/hooks/useCheckoutPage'

const addressFields = [
  ['street', 'Street'],
  ['city', 'City'],
  ['state', 'Province'],
  ['zip', 'ZIP / Postal code'],
  ['country', 'Country'],
  ['phone', 'Phone'],
]

const bankAccounts = [
  {
    accountName: 'J M P Nuwani',
    accountNumber: '321200190069692',
    bank: "People's Bank Panadura",
  },
  {
    accountName: 'J M P N Jayaweera',
    accountNumber: '0090429978',
    bank: 'BOC Panadura',
  },
]

export const CheckoutPage = () => {
  usePageTitle('Checkout | Thilani Watch Web')

  const checkout = useCheckoutPage()

  const handlePaymentSlipChange = (event) => {
    checkout.updatePaymentSlipFile(event.target.files?.[0])
    event.target.value = ''
  }

  return (
    <main className="bg-base text-white">
      {checkout.isPaymentSlipPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border border-white/12 bg-surface p-6 text-center shadow-glowSm">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
              <AlertCircle className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-heading text-lg font-bold text-white">Bank slip required</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Please upload your bank transfer payment slip before placing the order.
            </p>
            <button
              className="mt-5 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-black transition hover:shadow-glowSm"
              type="button"
              onClick={() => checkout.setIsPaymentSlipPopupOpen(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <section className="relative z-10 mx-auto max-w-[1200px] min-w-0 px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-10 lg:pt-20">
        <div className="mb-10">
          <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase text-white/75">Secure checkout</p>
          <h1 className="break-words font-heading text-4xl font-bold text-white sm:text-5xl">Complete your order</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">Confirm delivery details, attach your bank transfer slip, and place the order for review.</p>
        </div>
        {checkout.error && (
          <div className="mb-6 flex animate-fade-in items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm font-medium text-red-200 shadow-sm">
            <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {checkout.error}
          </div>
        )}

        {checkout.isLoading ? (
          <div className="rounded-lg border border-white/12 bg-surface p-12 shadow-glowSm">
            <LoadingState label="Preparing checkout" variant="form" />
          </div>
        ) : checkout.cart.items.length === 0 ? (
          <section className="mx-auto max-w-xl rounded-lg border border-white/12 bg-surface p-8 text-center shadow-glowSm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="mb-2 font-heading text-xl font-bold text-white">Your cart is empty</h2>
            <p className="mb-6 text-white/65">Add some high-quality watches to your cart before proceeding to checkout.</p>
            <Link className="inline-flex h-11 items-center justify-center rounded-full bg-white px-8 text-sm font-bold text-black no-underline shadow-md transition hover:scale-[1.02] hover:shadow-glow active:scale-[0.98]" to="/watches">
              Browse watches
            </Link>
          </section>
        ) : (
          <form className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]" onSubmit={checkout.handleSubmit}>
            <div className="grid gap-6">
              <AddressForm address={checkout.shippingAddress} legend="Shipping Address" setAddress={checkout.setShippingAddress} updateAddress={checkout.updateAddress} />

              <section className="rounded-lg border border-white/12 bg-surface p-5 shadow-glowSm">
                <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-white/65">
                  <input
                    checked={checkout.useShippingAsBilling}
                    className="h-5 w-5 rounded border-white/20 bg-black/35 text-white focus:ring-white/30 focus:ring-offset-0"
                    type="checkbox"
                    onChange={(event) => checkout.setUseShippingAsBilling(event.target.checked)}
                  />
                  Use shipping address as billing address
                </label>
              </section>

              {!checkout.useShippingAsBilling && <AddressForm address={checkout.billingAddress} legend="Billing Address" setAddress={checkout.setBillingAddress} updateAddress={checkout.updateAddress} />}

              <section className="rounded-lg border border-white/12 bg-surface p-6 shadow-glowSm">
                <label className="grid gap-2 text-sm font-semibold text-white/65">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-white/65" />
                    Wanted date
                    <span className="text-xs font-medium text-white/70">Optional</span>
                  </span>
                  <input
                    className={inputClass}
                    min={new Date().toISOString().slice(0, 10)}
                    type="date"
                    value={checkout.wantedDate}
                    onChange={(event) => checkout.setWantedDate(event.target.value)}
                  />
                </label>
              </section>

              <section className="rounded-lg border border-white/12 bg-surface p-6 shadow-glowSm">
                <h2 className="mb-4 font-heading text-lg font-bold text-white">Payment</h2>
                <div className="rounded-lg border border-white/12 bg-black/25 p-4">
                  <div className="mb-4 flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white shadow-sm">
                      <Upload className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">Bank transfer payment slip</p>
                      <p className="mt-1 text-xs font-medium leading-5 text-white/65">
                        Upload your payment slip file. Cash on delivery is no longer available.
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 grid min-w-0 gap-3 sm:grid-cols-2">
                    {bankAccounts.map((account) => (
                      <BankAccountCard account={account} key={`${account.bank}-${account.accountNumber}`} />
                    ))}
                  </div>

                  {checkout.paymentSlipFile ? (
                    <div className="grid min-w-0 gap-3 rounded-lg border border-white/12 bg-black/35 p-3 sm:grid-cols-[96px_minmax(0,1fr)]">
                      {checkout.paymentSlipPreview ? (
                        <img alt="Payment slip preview" className="h-24 w-24 rounded-lg border border-white/12 bg-black/35 object-cover" src={checkout.paymentSlipPreview} />
                      ) : (
                        <span className="flex h-24 w-24 items-center justify-center rounded-lg border border-white/12 bg-black/35 text-white">
                          <FileText className="h-8 w-8" />
                        </span>
                      )}
                      <div className="flex min-w-0 flex-col justify-between gap-3">
                        <div>
                          <p className="truncate text-sm font-semibold text-white">{checkout.paymentSlipFile?.name}</p>
                          <p className="mt-1 text-xs text-white/75">This file will be uploaded securely before the order is created.</p>
                        </div>
                        <button className="inline-flex h-9 w-fit cursor-pointer items-center justify-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-3 text-xs font-bold text-red-200 transition hover:bg-red-500/20" type="button" onClick={checkout.removePaymentSlipFile}>
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove slip
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/5 px-4 py-6 text-center transition hover:border-white/45 hover:shadow-glowSm">
                      <ImagePlus className="mb-2 h-7 w-7 text-white" />
                      <span className="text-sm font-bold text-white">Attach payment slip</span>
                      <span className="mt-1 text-xs font-medium text-white/75">Any file type up to 5MB</span>
                      <input className="hidden" type="file" onChange={handlePaymentSlipChange} />
                    </label>
                  )}
                </div>
              </section>

              <section className="grid gap-6 rounded-lg border border-white/12 bg-surface p-6 shadow-glowSm sm:grid-cols-2">
                <div className="flex flex-col justify-between gap-3 text-sm font-normal text-white/65">
                  <label className="grid gap-2 font-semibold">
                    Coupon code
                    <input className={inputClass} placeholder="e.g., WELCOME10" value={checkout.couponCode} onChange={(event) => checkout.updateCouponCode(event.target.value)} />
                  </label>
                  <button className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-black transition hover:shadow-glowSm disabled:cursor-not-allowed disabled:opacity-60" disabled={checkout.isValidatingCoupon} type="button" onClick={checkout.handleValidateCoupon}>
                    {checkout.isValidatingCoupon && <ButtonSpinner />} {checkout.isValidatingCoupon ? 'Checking' : 'Validate coupon'}
                  </button>
                  {checkout.couponMessage && (
                    <p className="m-0 w-fit rounded-lg border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white">
                      {checkout.couponMessage}
                    </p>
                  )}
                </div>
                <label className="grid gap-2 text-sm font-semibold text-white/65">
                  Order Notes
                  <textarea className={`${inputClass} h-[115px] resize-none`} placeholder="Notes about your order, e.g. special delivery instructions." value={checkout.notes} onChange={(event) => checkout.setNotes(event.target.value)} />
                </label>
              </section>
            </div>

            <aside className="h-fit rounded-lg border border-white/12 bg-surface p-5 shadow-glowSm sm:p-6 lg:sticky lg:top-6">
              <h2 className="mb-5 font-heading text-lg font-bold tracking-tight text-white">Order Summary</h2>

              <div className="space-y-4">
                <SummaryRow label="Subtotal" value={formatMoney(checkout.cart.subtotal, checkout.cart.currency || 'LKR')} />
                <SummaryRow label="Shipping" value={formatMoney(checkout.shippingFee, checkout.cart.currency || 'LKR')} />
                <SummaryRow isDiscount label="Discount" value={`-${formatMoney(checkout.discount, checkout.cart.currency || 'LKR')}`} />
              </div>

              <div className="my-5 border-t border-white/10" />
              <SummaryRow isStrong label="Total" value={formatMoney(checkout.total, checkout.cart.currency || 'LKR')} />

              <button className="mt-6 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-black shadow-lg transition hover:scale-[1.01] hover:shadow-glow active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60" disabled={checkout.isSubmitting} type="submit">
                {checkout.isSubmitting && <ButtonSpinner />} {checkout.isSubmitting ? 'Processing order' : 'Place order'}
              </button>
            </aside>
          </form>
        )}
      </section>
    </main>
  )
}

const inputClass = 'min-h-[45px] min-w-0 w-full rounded-lg border border-white/12 bg-black/35 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-white/65 focus:border-white/45 focus:ring-2 focus:ring-white/10'

const AddressForm = ({ address, legend, setAddress, updateAddress }) => (
  <fieldset className="grid min-w-0 gap-5 rounded-lg border border-white/12 bg-surface p-5 shadow-glowSm sm:p-6">
    <legend className="px-2 font-heading text-lg font-bold text-white">{legend}</legend>
    <div className="grid gap-5 sm:grid-cols-2">
      {addressFields.map(([name, label]) => (
        <label className="grid gap-1.5 text-sm font-semibold text-white/65" key={name}>
          {label}
          {name === 'state' ? (
            <select className={inputClass} required value={address[name]} onChange={(event) => updateAddress(setAddress, name, event.target.value)}>
              <option value="" disabled>Select province</option>
              {SRI_LANKA_PROVINCES.map((province) => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          ) : (
            <input className={inputClass} required value={address[name]} onChange={(event) => updateAddress(setAddress, name, event.target.value)} />
          )}
        </label>
      ))}
    </div>
  </fieldset>
)

const BankAccountCard = ({ account }) => (
  <article className="min-w-0 rounded-lg border border-white/12 bg-white/[0.04] p-4 shadow-sm">
    <p className="text-xs font-bold uppercase text-white/65">{account.bank}</p>
    <p className="mt-3 break-words font-mono text-base font-black tracking-wide text-white sm:text-lg">{account.accountNumber}</p>
    <p className="mt-2 text-sm font-semibold text-white/75">{account.accountName}</p>
  </article>
)

const SummaryRow = ({ isStrong = false, label, value, isDiscount = false }) => (
  <div className="flex min-w-0 items-center justify-between gap-3">
    <span className={`${isStrong ? 'text-base font-bold text-white' : 'text-sm font-medium text-white/65'}`}>{label}</span>
    <strong className={`min-w-0 break-words text-right ${isStrong ? 'text-xl text-white' : isDiscount ? 'text-sm font-semibold text-emerald-200' : 'text-sm font-semibold text-white'}`}>
      {value}
    </strong>
  </div>
)
