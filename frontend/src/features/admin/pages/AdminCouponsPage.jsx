import { ButtonSpinner, LoadingState } from '@/shared/ui/LoadingState'
import { useAdminCoupons } from '../hooks/useAdminCoupons'
import { formatDate, formatMoney, getId } from '../lib/adminUtils'

export const AdminCouponsPage = () => {
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
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-teal-600">Promotion Rules</p>
          <h2 className="m-0 text-3xl font-extrabold tracking-tight text-slate-900">Discount Coupons</h2>
          <p className="mt-1 text-xs text-slate-500">Configure and manage loyalty coupon rules and seasonal promotional codes</p>
        </div>
        <button
          type="button"
          onClick={openForm}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-xs font-bold text-white shadow-md shadow-teal-600/10 transition-all hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-600/20 active:scale-[0.98] cursor-pointer"
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
        <div className="w-full overflow-hidden border border-slate-200 bg-white rounded-2xl shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80">
                  {['Code Key', 'Redemption Rule', 'Min Spend', 'Redemption Depth', 'Expiration Timeline', 'Status', 'Configuration'].map((heading) => (
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500/90" key={heading}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((coupon) => {
                  const isActive = coupon.isActive !== false
                  return (
                    <tr key={getId(coupon)} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-5 py-4 font-bold text-slate-900 tracking-wide">
                        <span className="font-mono bg-slate-100 text-slate-800 px-2 py-1 rounded text-xs border border-slate-200/40">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-700 font-semibold text-xs">
                        {coupon.discountType === 'fixed' ? (
                          <span className="text-teal-700">{formatMoney(coupon.discountValue)} Off</span>
                        ) : (
                          <span className="text-indigo-700">{coupon.discountValue}% Off</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-medium">{coupon.minimumOrderAmount ? formatMoney(coupon.minimumOrderAmount) : <span className="text-slate-400 italic font-normal">No Minimum</span>}</td>
                      <td className="px-5 py-4 text-slate-600 text-xs font-medium">
                        Limit <span className="text-slate-900 font-semibold">{coupon.perUserLimit ?? '1'}</span> / account
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-medium">{formatDate(coupon.expiresAt)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold border transition-colors ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60 shadow-sm shadow-emerald-100' 
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
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
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-4">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">No active promotions</h4>
                        <p className="text-xs text-slate-400 mt-1 mb-4">There are no discount coupon configurations configured yet. Get started by creating your first promotional code.</p>
                        <button
                          type="button"
                          onClick={openForm}
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm"
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
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm transition-all duration-300" role="dialog" aria-modal="true" aria-label={editingId ? 'Modify coupon' : 'Create coupon'}>
          <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-[0_24px_50px_-12px_rgba(15,23,42,0.25)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-slate-50/50">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-teal-600">Promotion Rules</p>
                <h3 className="text-xl font-bold text-slate-950">{editingId ? 'Modify Coupon Settings' : 'Initialize New Coupon'}</h3>
              </div>
              <button 
                type="button" 
                onClick={closeFormWorkspace}
                disabled={isSaving}
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Close coupon form"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="min-h-0 overflow-y-auto p-6">
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
                  <Field label="Coupon Code" required value={form.code} onChange={(val) => updateField('code', val.toUpperCase())} placeholder="e.g. SUMMER50" />
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600">Discount Allocation</label>
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

                <label className="mt-2 flex w-fit cursor-pointer select-none items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-700">
                  <input 
                    checked={form.isActive} 
                    type="checkbox" 
                    className="h-4.5 w-4.5 rounded-lg border-slate-300 text-teal-600 focus:ring-teal-600/10 transition-colors"
                    onChange={(e) => updateField('isActive', e.target.checked)} 
                  />
                  Deploy As Globally Active
                </label>

                <div className="mt-4 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
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
    <label className="text-xs font-semibold text-slate-600">
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

const inputClass = 'w-full min-w-0 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none text-sm transition-all focus:border-teal-600 focus:ring-4 focus:ring-teal-600/5'

const baseBtnClass = 'inline-flex h-10 items-center justify-center rounded-xl px-5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'
const secondaryBtnClass = `${baseBtnClass} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-sm`
const emeraldBtnClass = `${baseBtnClass} border border-teal-600 bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/5`

const smallButtonClass = 'inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer shadow-sm'
const smallDeactivateClass = 'inline-flex h-8 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 px-3 text-xs font-bold text-rose-700 hover:bg-rose-100 hover:border-rose-200 transition-colors cursor-pointer'
