import { Link } from 'react-router'
import { AlertCircle, CalendarDays, FileText, ImagePlus, Trash2, Upload, ArrowRight, CheckCircle2, Lock } from 'lucide-react'
import { ButtonSpinner, LoadingState } from '@/shared/ui/LoadingState'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { formatMoney } from '@/features/storefront/lib/storefrontUtils'
import { SRI_LANKA_PROVINCES } from '@/features/orders/lib/orderUtils'
import { useCheckoutPage } from '@/features/orders/hooks/useCheckoutPage'

const addressFields = [
  ['street', 'Street Address'],
  ['city', 'City'],
  ['state', 'Province'],
  ['zip', 'ZIP / Postal code'],
  ['country', 'Country'],
  ['phone', 'Phone Number'],
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

const CheckoutPage = () => {
  usePageTitle('Checkout | Thilani Watch Web')

  const checkout = useCheckoutPage()

  const handlePaymentSlipChange = (event) => {
    checkout.updatePaymentSlipFile(event.target.files?.[0])
    event.target.value = ''
  }

  return (
    <main className="min-h-screen bg-base pb-24 text-black">
      {/* Required Payment Slip Modal */}
      {checkout.isPaymentSlipPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md transition-all">
          <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 shadow-inner">
              <AlertCircle className="h-8 w-8" />
            </span>
            <h2 className="mt-5 font-heading text-2xl font-bold tracking-tight text-black">Bank slip required</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Please upload your bank transfer payment slip before placing your order to ensure fast verification.
            </p>
            <button
              className="mt-6 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-black px-6 text-sm font-bold text-white shadow-lg transition-all hover:bg-stone-800 active:scale-98"
              type="button"
              onClick={() => checkout.setIsPaymentSlipPopupOpen(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {checkout.isSessionRestoring && <RestoringSessionModal />}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-100/80 via-base to-base px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-10 border-b border-black/5">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[700px] rounded-full bg-gradient-to-tr from-amber-200/20 via-orange-100/10 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px] min-w-0">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/85 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black shadow-sm backdrop-blur-md">
            <Lock className="h-3.5 w-3.5 text-amber-600" />
            Secure Checkout
          </div>
          <h1 className="break-words font-heading text-[42px] font-extrabold tracking-tight leading-[1.05] text-black sm:text-[60px] lg:text-[76px]">
            Complete your order
          </h1>
          <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-stone-600 sm:text-lg">
            Confirm your delivery details, attach your bank transfer receipt, and place your order securely for expert review.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-6 lg:px-10">
        {checkout.error && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm font-medium text-red-700 shadow-sm backdrop-blur-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <span>{checkout.error}</span>
          </div>
        )}

        {checkout.isLoading ? (
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:p-8">
            <LoadingState label="Preparing checkout details" variant="form" />
          </div>
        ) : checkout.cart.items.length === 0 ? (
          <section className="mx-auto my-12 max-w-xl rounded-3xl border border-dashed border-black/15 bg-white/60 p-8 text-center shadow-xl shadow-black/[0.02] backdrop-blur-md sm:p-14">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-black/5 shadow-inner">
              <svg className="h-9 w-9 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="mb-3 font-heading text-2xl font-bold tracking-tight text-black">Your cart is empty</h2>
            <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-stone-600">
              Add some high-quality watches to your cart before proceeding to complete your secure checkout.
            </p>
            <Link
              className="inline-flex h-12 w-fit items-center justify-center rounded-full bg-black px-8 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-stone-800 hover:shadow-xl active:scale-98"
              to="/watches"
            >
              Browse watches
            </Link>
          </section>
        ) : (
          <form className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_400px]" onSubmit={checkout.handleSubmit}>
            <div className="grid gap-6">
              {/* Shipping Address */}
              <AddressForm
                address={checkout.shippingAddress}
                addressType="shipping"
                fieldErrors={checkout.fieldErrors}
                legend="Shipping Address"
                markAddressFieldTouched={checkout.markAddressFieldTouched}
                setAddress={checkout.setShippingAddress}
                touchedFields={checkout.touchedFields}
                updateAddress={checkout.updateAddress}
              />

              {/* Billing Toggle */}
              <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition hover:border-black/20">
                <label className="flex cursor-pointer items-center gap-3.5 text-sm font-bold text-black select-none">
                  <input
                    checked={checkout.useShippingAsBilling}
                    className="h-5 w-5 rounded-md border-black/20 bg-stone-50 text-black accent-black focus:ring-2 focus:ring-black/10"
                    type="checkbox"
                    onChange={(event) => checkout.setUseShippingAsBilling(event.target.checked)}
                  />
                  Use shipping address as billing address
                </label>
              </section>

              {/* Billing Address (if separate) */}
              {!checkout.useShippingAsBilling && (
                <AddressForm
                  address={checkout.billingAddress}
                  addressType="billing"
                  fieldErrors={checkout.fieldErrors}
                  legend="Billing Address"
                  markAddressFieldTouched={checkout.markAddressFieldTouched}
                  setAddress={checkout.setBillingAddress}
                  touchedFields={checkout.touchedFields}
                  updateAddress={checkout.updateAddress}
                />
              )}

              {/* Wanted Date */}
              <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <label className="grid gap-2.5 text-sm font-bold text-black">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-amber-600" />
                    Wanted delivery date
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-500">Optional</span>
                  </span>
                  <input
                    aria-invalid={Boolean(checkout.fieldErrors.wantedDate)}
                    className={getInputClass(checkout.fieldErrors.wantedDate)}
                    min={checkout.minimumWantedDate}
                    type="date"
                    value={checkout.wantedDate}
                    onChange={(event) => checkout.setWantedDate(event.target.value)}
                  />
                  {checkout.fieldErrors.wantedDate && <FieldError>{checkout.fieldErrors.wantedDate}</FieldError>}
                </label>
              </section>

              {/* Payment & Bank Transfer Slips */}
              <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/10">
                  <h2 className="font-heading text-xl font-bold tracking-tight text-black">Payment Information</h2>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 border border-amber-200/60">Bank Transfer Only</span>
                </div>

                <div className="rounded-2xl border border-black/10 bg-stone-50/70 p-5 mb-6">
                  <div className="mb-4 flex items-start gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-sm">
                      <Upload className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-black">Direct Bank Transfer Instructions</p>
                      <p className="mt-1 text-xs font-medium leading-relaxed text-stone-600">
                        Please transfer the total amount to one of the accounts below, then attach your bank payment slip. Cash on delivery is unavailable.
                      </p>
                    </div>
                  </div>

                  <div className="grid min-w-0 gap-4 sm:grid-cols-2 mb-6">
                    {bankAccounts.map((account) => (
                      <BankAccountCard account={account} key={`${account.bank}-${account.accountNumber}`} />
                    ))}
                  </div>

                  {checkout.paymentSlipFile ? (
                    <div className="grid min-w-0 gap-4 rounded-2xl border border-black/15 bg-white p-4 sm:grid-cols-[100px_minmax(0,1fr)] items-center shadow-sm">
                      {checkout.paymentSlipPreview ? (
                        <img alt="Payment slip preview" className="h-24 w-24 rounded-xl border border-black/10 object-cover bg-stone-100" src={checkout.paymentSlipPreview} />
                      ) : (
                        <span className="flex h-24 w-24 items-center justify-center rounded-xl border border-black/10 bg-stone-100 text-stone-700">
                          <FileText className="h-8 w-8" />
                        </span>
                      )}
                      <div className="flex min-w-0 flex-col justify-between gap-3">
                        <div>
                          <p className="truncate text-sm font-bold text-black">{checkout.paymentSlipFile?.name}</p>
                          <p className="mt-1 text-xs text-stone-500">Ready to upload securely with your order.</p>
                        </div>
                        <button
                          className="inline-flex h-9 w-fit cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 text-xs font-bold text-red-600 transition-all hover:bg-red-500 hover:text-white active:scale-95"
                          type="button"
                          onClick={checkout.removePaymentSlipFile}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove slip
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/15 bg-white px-4 py-8 text-center transition-all hover:border-black/30 hover:bg-stone-50/50">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-700 shadow-inner">
                        <ImagePlus className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-bold text-black">Click to attach payment slip</span>
                      <span className="mt-1 text-xs text-stone-500">Supports images or documents up to 5MB</span>
                      <input className="hidden" type="file" onChange={handlePaymentSlipChange} />
                    </label>
                  )}
                  {checkout.fieldErrors.paymentSlip && <FieldError>{checkout.fieldErrors.paymentSlip}</FieldError>}
                </div>
              </section>

              {/* Coupon & Notes */}
              <section className="grid gap-6 rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:grid-cols-2">
                <div className="flex flex-col justify-between gap-3.5">
                  <label className="grid gap-2 text-sm font-bold text-black">
                    Coupon code
                    <input
                      className={inputClass}
                      placeholder="e.g., WELCOME10"
                      value={checkout.couponCode}
                      onChange={(event) => checkout.updateCouponCode(event.target.value)}
                    />
                  </label>
                  <button
                    className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-black px-6 text-sm font-bold text-white shadow-md transition-all hover:bg-stone-800 active:scale-98 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={checkout.isValidatingCoupon}
                    type="button"
                    onClick={checkout.handleValidateCoupon}
                  >
                    {checkout.isValidatingCoupon && <ButtonSpinner />}
                    {checkout.isValidatingCoupon ? 'Checking code...' : 'Apply coupon'}
                  </button>
                  {checkout.couponMessage && (
                    <p className="m-0 w-fit rounded-xl border border-emerald-500/20 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      {checkout.couponMessage}
                    </p>
                  )}
                </div>

                <label className="grid gap-2 text-sm font-bold text-black">
                  Order notes
                  <textarea
                    className={`${inputClass} h-[118px] resize-none`}
                    placeholder="Notes about your order, e.g. special delivery instructions."
                    value={checkout.notes}
                    onChange={(event) => checkout.setNotes(event.target.value)}
                  />
                </label>
              </section>
            </div>

            {/* Sidebar Summary */}
            <aside className="h-fit rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] lg:sticky lg:top-28">
              <h2 className="mb-6 font-heading text-xl font-bold tracking-tight text-black border-b border-black/10 pb-4">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <SummaryRow label="Subtotal" value={formatMoney(checkout.cart.subtotal, checkout.cart.currency || 'LKR')} />
                <SummaryRow label="Shipping" value={formatMoney(checkout.shippingFee, checkout.cart.currency || 'LKR')} />
                <SummaryRow isDiscount label="Discount" value={`-${formatMoney(checkout.discount, checkout.cart.currency || 'LKR')}`} />
              </div>

              <div className="my-6 border-t border-black/10 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black text-base">Total Amount</span>
                  <strong className="font-heading text-2xl font-extrabold text-black font-mono">
                    {formatMoney(checkout.total, checkout.cart.currency || 'LKR')}
                  </strong>
                </div>
              </div>

              <button
                className="mt-2 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-black px-8 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all duration-300 hover:bg-stone-800 hover:shadow-xl active:scale-98 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={checkout.isSubmitting}
                type="submit"
              >
                {checkout.isSubmitting && <ButtonSpinner />}
                {checkout.isSubmitting ? 'Processing order...' : 'Place order'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </aside>
          </form>
        )}
      </section>
    </main>
  )
}

export default CheckoutPage

const inputClass = 'min-h-[46px] min-w-0 w-full rounded-2xl border border-black/15 bg-stone-50/50 px-4 py-2.5 text-sm font-medium text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10 placeholder:text-stone-400'
const errorInputClass = 'border-red-500/70 bg-red-50/40 focus:border-red-600 focus:ring-red-500/20'

const getInputClass = (error) => `${inputClass} ${error ? errorInputClass : ''}`

const AddressForm = ({ address, addressType, fieldErrors, legend, markAddressFieldTouched, setAddress, touchedFields, updateAddress }) => (
  <fieldset className="grid min-w-0 gap-6 rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
    <legend className="px-2 font-heading text-xl font-bold tracking-tight text-black">{legend}</legend>
    <div className="grid gap-5 sm:grid-cols-2 pt-2">
      {addressFields.map(([name, label]) => {
        const fieldKey = `${addressType}.${name}`
        const error = touchedFields[fieldKey] ? fieldErrors[fieldKey] : ''

        return (
          <label className="grid gap-2 text-sm font-bold text-black" key={name}>
            {label}
            {name === 'state' ? (
              <select
                aria-invalid={Boolean(error)}
                className={getInputClass(error)}
                required
                value={address[name]}
                onBlur={() => markAddressFieldTouched(addressType, name, address[name])}
                onChange={(event) => updateAddress(setAddress, name, event.target.value, addressType)}
              >
                <option value="" disabled>Select province</option>
                {SRI_LANKA_PROVINCES.map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            ) : (
              <input
                aria-invalid={Boolean(error)}
                className={getInputClass(error)}
                inputMode={name === 'phone' ? 'tel' : undefined}
                required
                value={address[name]}
                onBlur={() => markAddressFieldTouched(addressType, name, address[name])}
                onChange={(event) => updateAddress(setAddress, name, event.target.value, addressType)}
              />
            )}
            {error && <FieldError>{error}</FieldError>}
          </label>
        )
      })}
    </div>
  </fieldset>
)

const FieldError = ({ children }) => (
  <span className="flex items-start gap-1.5 text-xs font-semibold leading-snug text-red-600">
    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    {children}
  </span>
)

const RestoringSessionModal = () => (
  <div className="fixed inset-0 z-40 grid place-items-center bg-black/45 px-4 backdrop-blur-sm">
    <section
      aria-live="polite"
      className="w-full max-w-sm rounded-3xl border border-black/10 bg-white p-6 text-center text-black shadow-2xl shadow-black/20"
      role="status"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 shadow-inner">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-amber-600/25 border-t-amber-600" />
      </span>
      <h2 className="mt-5 font-heading text-2xl font-bold tracking-tight text-black">Restoring session</h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        We are preparing your checkout details and saved cart.
      </p>
    </section>
  </div>
)

const BankAccountCard = ({ account }) => (
  <article className="min-w-0 rounded-2xl border border-black/10 bg-white p-4.5 shadow-sm transition hover:border-black/25">
    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">{account.bank}</p>
    <p className="mt-2 break-words font-mono text-base font-extrabold tracking-wide text-black">{account.accountNumber}</p>
    <p className="mt-1 text-xs font-semibold text-stone-600">{account.accountName}</p>
  </article>
)

const SummaryRow = ({ isStrong = false, label, value, isDiscount = false }) => (
  <div className="flex min-w-0 items-center justify-between gap-3 text-sm">
    <span className={isStrong ? 'font-bold text-black' : 'font-medium text-stone-600'}>{label}</span>
    <strong className={`min-w-0 break-words text-right font-mono ${isStrong ? 'text-lg text-black' : isDiscount ? 'font-bold text-emerald-600' : 'font-bold text-black'}`}>
      {value}
    </strong>
  </div>
)
