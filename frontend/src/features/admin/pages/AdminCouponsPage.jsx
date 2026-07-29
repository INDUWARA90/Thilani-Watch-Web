import { ButtonSpinner, LoadingState } from '@/shared/ui/LoadingState'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { useAdminCoupons } from '../hooks/useAdminCoupons'
import { formatDate, formatMoney, getId } from '../lib/adminUtils'

export const AdminCouponsPage = () => {
  usePageTitle('Admin Coupons | Thilani Watch Web')

  const {
    closeFormWorkspace,
    coupons,
    deactivateCoupon,
    editCoupon,
    editingId,
    error,
    form,
    handleSubmit,
    isFormOpen,
    isLoading,
    isSaving,
    openForm,
    updateField,
  } = useAdminCoupons()

  return (
    <div className="w-full flex flex-col text-sm max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Upper Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-accent">Promotion Rules</p>
          <h2 className="m-0 font-heading text-3xl font-extrabold tracking-wide text-primary">Discount Coupons</h2>
          <p className="mt-1 text-xs text-primary">Configure and manage loyalty coupon rules and seasonal promotional codes</p>
        </div>
        <button
          type="button"
          onClick={openForm}
          className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-md shadow-black/10 transition-all hover:bg-primary hover:shadow-lg hover:shadow-black/10 active:scale-[0.98] sm:w-fit"
        >
          <svg className="h-4 w-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Coupon
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs font-semibold text-rose-800 shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <svg className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Main Ledger Table Content */}
      {isLoading ? (
        <LoadingState label="Loading coupons" variant="table" rows={5} />
      ) : (
        <div className="w-full overflow-hidden border border-black/10 bg-[#FFFEFA] rounded-2xl shadow-sm">
          <div className="divide-y divide-black/5 md:hidden">
            {coupons.map((coupon) => {
              const isActive = coupon.isActive !== false
              return (
                <article className="p-4" key={getId(coupon)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="inline-block max-w-full break-all rounded border border-black/10 bg-black/5 px-2 py-1 font-sans text-xs font-bold tracking-wide text-primary">
                        {coupon.code}
                      </span>
                      <p className="mt-2 text-sm font-bold text-primary">
                        {coupon.discountType === 'fixed' ? `${formatMoney(coupon.discountValue)} Off` : `${coupon.discountValue}% Off`}
                      </p>
                    </div>
                    <span className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition-colors ${
                      isActive
                        ? 'border-emerald-200/60 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100'
                        : 'border-black/10 bg-[#FAF9F5] text-primary'
                    }`}>
                      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-black/20'}`} />
                      {isActive ? 'Active' : 'Archived'}
                    </span>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#FAF9F5]/80 p-3 text-xs">
                    <div>
                      <dt className="font-bold uppercase tracking-wide text-primary">Min spend</dt>
                      <dd className="mt-1 font-semibold text-primary">{coupon.minimumOrderAmount ? formatMoney(coupon.minimumOrderAmount) : 'No Minimum'}</dd>
                    </div>
                    <div>
                      <dt className="font-bold uppercase tracking-wide text-primary">Limit</dt>
                      <dd className="mt-1 font-semibold text-primary">{coupon.perUserLimit ?? '1'} / account</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="font-bold uppercase tracking-wide text-primary">Expires</dt>
                      <dd className="mt-1 font-semibold text-primary">{formatDate(coupon.expiresAt)}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 grid gap-2 min-[420px]:grid-cols-2">
                    <button className={`${smallButtonClass} h-9 w-full`} type="button" onClick={() => editCoupon(coupon)}>
                      Modify
                    </button>
                    {isActive && (
                      <button className={`${smallDeactivateClass} h-9 w-full`} type="button" onClick={() => deactivateCoupon(coupon)}>
                        Disable
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
            {coupons.length === 0 && (
              <div className="p-8 text-center">
                <div className="mx-auto flex max-w-sm flex-col items-center justify-center">
                  <h4 className="text-sm font-bold text-primary">No active promotions</h4>
                  <p className="mb-4 mt-1 text-xs text-primary">There are no discount coupon configurations configured yet.</p>
                  <button
                    type="button"
                    onClick={openForm}
                    className="inline-flex h-8 cursor-pointer items-center justify-center rounded-lg border border-black/10 bg-[#FFFEFA] px-3 text-xs font-semibold text-primary shadow-sm hover:bg-[#FAF9F5]"
                  >
                    Add New Coupon
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden w-full overflow-x-auto md:block">
            <table className="w-full min-w-[950px] border-collapse text-left">
              <thead>
                <tr className="bg-[#FAF9F5]/90 border-b border-black/10">
                  {['Code Key', 'Redemption Rule', 'Min Spend', 'Redemption Depth', 'Expiration Timeline', 'Status', 'Configuration'].map((heading) => (
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-primary" key={heading}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {coupons.map((coupon) => {
                  const isActive = coupon.isActive !== false
                  return (
                    <tr key={getId(coupon)} className="hover:bg-[#FAF9F5]/80 transition-colors group">
                      <td className="px-5 py-4 font-bold text-primary tracking-wide">
                        <span className="font-sans bg-black/5 text-primary px-2 py-1 rounded text-xs border border-black/10">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-primary font-semibold text-xs">
                        {coupon.discountType === 'fixed' ? (
                          <span className="text-primary">{formatMoney(coupon.discountValue)} Off</span>
                        ) : (
                          <span className="text-indigo-700">{coupon.discountValue}% Off</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-primary font-medium">{coupon.minimumOrderAmount ? formatMoney(coupon.minimumOrderAmount) : <span className="text-primary italic font-normal">No Minimum</span>}</td>
                      <td className="px-5 py-4 text-primary text-xs font-medium">
                        Limit <span className="text-primary font-semibold">{coupon.perUserLimit ?? '1'}</span> / account
                      </td>
                      <td className="px-5 py-4 text-primary font-medium">{formatDate(coupon.expiresAt)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold border transition-colors ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60 shadow-sm shadow-emerald-100' 
                            : 'bg-[#FAF9F5] text-primary border-black/10'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-emerald-500' : 'bg-black/20'}`} />
                          {isActive ? 'Active' : 'Archived'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 opacity-90 group-hover:opacity-100">
                          <button className={smallButtonClass} type="button" onClick={() => editCoupon(coupon)}>
                            Modify
                          </button>
                          {isActive && (
                            <button className={smallDeactivateClass} type="button" onClick={() => deactivateCoupon(coupon)}>
                              Disable
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {coupons.length === 0 && (
                  <tr>
                    <td className="p-12 text-center" colSpan={7}>
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent mb-4">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                        </div>
                        <h4 className="text-sm font-bold text-primary">No active promotions</h4>
                        <p className="text-xs text-primary mt-1 mb-4">There are no discount coupon configurations configured yet. Get started by creating your first promotional code.</p>
                        <button
                          type="button"
                          onClick={openForm}
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-black/10 bg-[#FFFEFA] px-3 text-xs font-semibold text-primary hover:bg-[#FAF9F5] cursor-pointer shadow-sm"
                        >
                          Add New Coupon
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm transition-all duration-300" role="dialog" aria-modal="true" aria-label={editingId ? 'Modify coupon' : 'Create coupon'}>
          <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-[#FFFEFA] border border-black/10 shadow-[0_24px_50px_-12px_rgba(15,23,42,0.25)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-5 bg-[#FAF9F5]/75">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-accent">Promotion Rules</p>
                <h3 className="font-heading text-xl font-bold tracking-wide text-primary">{editingId ? 'Modify Coupon Settings' : 'Initialize New Coupon'}</h3>
              </div>
              <button 
                type="button" 
                onClick={closeFormWorkspace}
                disabled={isSaving}
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-black/10 bg-[#FFFEFA] text-primary hover:text-primary hover:bg-black/5 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Close coupon form"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="min-h-0 overflow-y-auto p-4 sm:p-6">
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
                  <Field label="Coupon Code" required value={form.code} onChange={(val) => updateField('code', val.toUpperCase())} placeholder="e.g. SUMMER50" />
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-primary">Discount Allocation</label>
                    <select className={inputClass} value={form.discountType} onChange={(e) => updateField('discountType', e.target.value)}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Capital Value</option>
                    </select>
                  </div>

                  <Field label="Discount Value" required type="number" value={form.discountValue} onChange={(val) => updateField('discountValue', val)} placeholder="Value" />
                  <Field label="Minimum Cart Order" type="number" value={form.minimumOrderAmount} onChange={(val) => updateField('minimumOrderAmount', val)} placeholder="Optional" />
                  <Field label="Maximum Cap Value" type="number" value={form.maxDiscountAmount} onChange={(val) => updateField('maxDiscountAmount', val)} placeholder="Optional" />
                  <Field label="Global Usage Limit" type="number" value={form.usageLimit} onChange={(val) => updateField('usageLimit', val)} placeholder="Total redeems allowed" />
                  <Field label="Per-Customer Redemptions" type="number" value={form.perUserLimit} onChange={(val) => updateField('perUserLimit', val)} />
                  <Field label="Activation Date" type="date" value={form.startsAt} onChange={(val) => updateField('startsAt', val)} />
                  <Field label="Expiration Date" required type="date" value={form.expiresAt} onChange={(val) => updateField('expiresAt', val)} />
                </div>

                <label className="mt-2 flex w-fit cursor-pointer select-none items-center gap-3 text-xs font-semibold uppercase tracking-wider text-primary">
                  <input 
                    checked={form.isActive} 
                    type="checkbox" 
                    className="h-4.5 w-4.5 rounded-lg border-black/15 text-accent focus:ring-accent/20 transition-colors"
                    onChange={(e) => updateField('isActive', e.target.checked)} 
                  />
                  Deploy As Globally Active
                </label>

                <div className="mt-4 flex flex-col gap-3 border-t border-black/5 pt-5 sm:flex-row sm:items-center sm:justify-end">
                  <button className={secondaryBtnClass} disabled={isSaving} type="button" onClick={closeFormWorkspace}>
                    Dismiss
                  </button>
                  <button className={emeraldBtnClass} disabled={isSaving} type="submit">
                    {isSaving && <ButtonSpinner />} {editingId ? 'Save Changes' : 'Initialize Coupon'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const Field = ({ label, onChange, required = false, type = 'text', value, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-primary">
      {label} {required && <span className="text-rose-500 font-bold">*</span>}
    </label>
    <input 
      className={inputClass} 
      required={required} 
      type={type} 
      value={value} 
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)} 
    />
  </div>
)

const inputClass = 'w-full min-w-0 rounded-xl border border-black/10 bg-[#FFFEFA] px-3.5 py-2.5 text-primary placeholder:text-primary outline-none text-sm transition-all focus:border-accent focus:ring-4 focus:ring-accent/20'

const baseBtnClass = 'inline-flex h-10 items-center justify-center rounded-xl px-5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'
const secondaryBtnClass = `${baseBtnClass} border border-black/10 bg-[#FFFEFA] text-primary hover:bg-[#FAF9F5] hover:text-primary hover:border-black/15 shadow-sm`
const emeraldBtnClass = `${baseBtnClass} border border-primary bg-primary text-white hover:bg-primary shadow-md shadow-black/10`

const smallButtonClass = 'inline-flex h-8 items-center justify-center rounded-lg border border-black/10 bg-[#FFFEFA] px-3 text-xs font-bold text-primary hover:bg-[#FAF9F5] hover:text-primary transition-colors cursor-pointer shadow-sm'
const smallDeactivateClass = 'inline-flex h-8 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 px-3 text-xs font-bold text-rose-700 hover:bg-rose-100 hover:border-rose-200 transition-colors cursor-pointer'


