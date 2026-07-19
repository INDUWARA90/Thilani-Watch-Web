import { Link } from 'react-router'
import { AlertCircle, FileText, ImagePlus, Trash2, Upload } from 'lucide-react'
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
    <main className="-mx-4 -mt-22 bg-white sm:-mx-6 lg:-mx-8">
      {checkout.isPaymentSlipPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-orange-100 bg-white p-6 text-center shadow-2xl">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <AlertCircle className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-slate-900">Bank slip required</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Please upload your bank transfer payment slip before placing the order.
            </p>
            <button
              className="mt-5 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-[#F49006] px-5 text-sm font-semibold text-white transition hover:bg-[#EB960E]"
              type="button"
              onClick={() => checkout.setIsPaymentSlipPopupOpen(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <section className="relative z-10 mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-10 lg:pt-20">
        {checkout.error && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 shadow-sm animate-fade-in">
            <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {checkout.error}
          </div>
        )}

        {checkout.isLoading ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 shadow-sm">
            <LoadingState label="Preparing checkout" variant="form" />
          </div>
        ) : checkout.cart.items.length === 0 ? (
          <section className="mx-auto max-w-xl rounded-2xl border border-slate-150 bg-white p-8 text-center shadow-md">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-800">Your cart is empty</h2>
            <p className="mb-6 text-slate-500">Add some high-quality watches to your cart before proceeding to checkout.</p>
            <Link className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#F49006] to-[#EB960E] px-8 text-sm font-semibold text-white no-underline shadow-md shadow-orange-500/20 transition-all duration-200 hover:scale-[1.02] hover:opacity-95 active:scale-[0.98]" to="/watches">
              Browse watches
            </Link>
          </section>
        ) : (
          <form className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]" onSubmit={checkout.handleSubmit}>
            <div className="grid gap-6">
              <AddressForm address={checkout.shippingAddress} legend="Shipping Address" setAddress={checkout.setShippingAddress} updateAddress={checkout.updateAddress} />

              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md/50">
                <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700">
                  <input
                    checked={checkout.useShippingAsBilling}
                    className="h-5 w-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500 focus:ring-offset-2"
                    type="checkbox"
                    onChange={(event) => checkout.setUseShippingAsBilling(event.target.checked)}
                  />
                  Use shipping address as billing address
                </label>
              </section>

              {!checkout.useShippingAsBilling && <AddressForm address={checkout.billingAddress} legend="Billing Address" setAddress={checkout.setBillingAddress} updateAddress={checkout.updateAddress} />}

              <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-800">Payment</h2>
                <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4">
                  <div className="mb-4 flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm">
                      <Upload className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Bank transfer payment slip</p>
                      <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                        Upload your payment slip file. Cash on delivery is no longer available.
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 grid gap-3 sm:grid-cols-2">
                    {bankAccounts.map((account) => (
                      <BankAccountCard account={account} key={`${account.bank}-${account.accountNumber}`} />
                    ))}
                  </div>

                  {checkout.paymentSlipFile ? (
                    <div className="grid gap-3 rounded-xl border border-slate-100 bg-white p-3 sm:grid-cols-[96px_minmax(0,1fr)]">
                      {checkout.paymentSlipPreview ? (
                        <img alt="Payment slip preview" className="h-24 w-24 rounded-lg border border-slate-100 bg-slate-50 object-cover" src={checkout.paymentSlipPreview} />
                      ) : (
                        <span className="flex h-24 w-24 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-orange-500">
                          <FileText className="h-8 w-8" />
                        </span>
                      )}
                      <div className="flex min-w-0 flex-col justify-between gap-3">
                        <div>
                          <p className="truncate text-sm font-semibold text-slate-800">{checkout.paymentSlipFile?.name}</p>
                          <p className="mt-1 text-xs text-slate-400">This file will be uploaded securely before the order is created.</p>
                        </div>
                        <button className="inline-flex h-9 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-100" type="button" onClick={checkout.removePaymentSlipFile}>
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove slip
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-200 bg-white px-4 py-6 text-center transition hover:border-orange-400 hover:bg-orange-50/40">
                      <ImagePlus className="mb-2 h-7 w-7 text-orange-500" />
                      <span className="text-sm font-bold text-slate-800">Attach payment slip</span>
                      <span className="mt-1 text-xs font-medium text-slate-400">Any file type up to 5MB</span>
                      <input className="hidden" type="file" onChange={handlePaymentSlipChange} />
                    </label>
                  )}
                </div>
              </section>

              <section className="grid gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:grid-cols-2">
                <div className="flex flex-col justify-between gap-3 text-sm font-normal text-slate-700">
                  <label className="grid gap-2 font-semibold">
                    Coupon code
                    <input className={inputClass} placeholder="e.g., WELCOME10" value={checkout.couponCode} onChange={(event) => checkout.updateCouponCode(event.target.value)} />
                  </label>
                  <button className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={checkout.isValidatingCoupon} type="button" onClick={checkout.handleValidateCoupon}>
                    {checkout.isValidatingCoupon && <ButtonSpinner />} {checkout.isValidatingCoupon ? 'Checking' : 'Validate coupon'}
                  </button>
                  {checkout.couponMessage && (
                    <p className="m-0 w-fit rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
                      {checkout.couponMessage}
                    </p>
                  )}
                </div>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Order Notes
                  <textarea className={`${inputClass} h-[115px] resize-none`} placeholder="Notes about your order, e.g. special delivery instructions." value={checkout.notes} onChange={(event) => checkout.setNotes(event.target.value)} />
                </label>
              </section>
            </div>

            <aside className="sticky top-6 h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <h2 className="mb-5 text-lg font-bold tracking-tight text-slate-800">Order Summary</h2>

              <div className="space-y-4">
                <SummaryRow label="Subtotal" value={formatMoney(checkout.cart.subtotal, checkout.cart.currency || 'LKR')} />
                <SummaryRow label="Shipping" value={formatMoney(checkout.shippingFee, checkout.cart.currency || 'LKR')} />
                <SummaryRow isDiscount label="Discount" value={`-${formatMoney(checkout.discount, checkout.cart.currency || 'LKR')}`} />
              </div>

              <div className="my-5 border-t border-slate-100" />
              <SummaryRow isStrong label="Total" value={formatMoney(checkout.total, checkout.cart.currency || 'LKR')} />

              <button className="mt-6 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F49006] to-[#EB960E] px-8 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 transition-all duration-200 hover:scale-[1.01] hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60" disabled={checkout.isSubmitting} type="submit">
                {checkout.isSubmitting && <ButtonSpinner />} {checkout.isSubmitting ? 'Processing order' : 'Place order'}
              </button>
            </aside>
          </form>
        )}
      </section>
    </main>
  )
}

const inputClass = 'min-h-[45px] min-w-0 w-full rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-400/10'

const AddressForm = ({ address, legend, setAddress, updateAddress }) => (
  <fieldset className="grid gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
    <legend className="px-2 text-lg font-bold text-slate-800">{legend}</legend>
    <div className="grid gap-5 sm:grid-cols-2">
      {addressFields.map(([name, label]) => (
        <label className="grid gap-1.5 text-sm font-semibold text-slate-700" key={name}>
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
  <article className="rounded-xl border border-orange-100 bg-white p-4 shadow-sm">
    <p className="text-xs font-bold uppercase tracking-wide text-orange-500">{account.bank}</p>
    <p className="mt-3 font-mono text-lg font-black tracking-wide text-slate-900">{account.accountNumber}</p>
    <p className="mt-2 text-sm font-semibold text-slate-700">{account.accountName}</p>
  </article>
)

const SummaryRow = ({ isStrong = false, label, value, isDiscount = false }) => (
  <div className="flex items-center justify-between gap-3">
    <span className={`${isStrong ? 'text-base font-bold text-slate-800' : 'text-sm font-medium text-slate-500'}`}>{label}</span>
    <strong className={`${isStrong ? 'text-xl text-[#EB960E]' : isDiscount ? 'text-sm font-semibold text-emerald-600' : 'text-sm font-semibold text-slate-800'}`}>
      {value}
    </strong>
  </div>
)
