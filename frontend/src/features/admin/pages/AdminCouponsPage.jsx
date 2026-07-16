import { useEffect, useState } from 'react'
import { ButtonSpinner, LoadingState } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { formatDate, formatMoney, getId, normalizeList } from '../lib/adminUtils'

const emptyCoupon = {
  code: '',
  discountType: 'percentage',
  discountValue: '',
  expiresAt: '',
  isActive: true,
  maxDiscountAmount: '',
  minimumOrderAmount: '',
  perUserLimit: '1',
  startsAt: '',
  usageLimit: '',
}

export const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([])
  const [form, setForm] = useState(emptyCoupon)
  const [editingId, setEditingId] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const loadCoupons = async () => {
    setError('')
    try {
      const payload = await adminApi.getCoupons()
      setCoupons(normalizeList(payload, ['coupons']))
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load coupons.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        const payload = await adminApi.getCoupons()
        if (isMounted) {
          setCoupons(normalizeList(payload, ['coupons']))
          setError('')
        }
      } catch (apiError) {
        if (isMounted) {
          setError(getApiErrorMessage(apiError, 'Unable to load coupons.'))
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

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSaving(true)
    try {
      const payload = toCouponPayload(form)
      if (editingId) {
        await adminApi.updateCoupon(editingId, payload)
      } else {
        await adminApi.createCoupon(payload)
      }
      setForm(emptyCoupon)
      setEditingId('')
      await loadCoupons()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to save coupon.'))
    } finally {
      setIsSaving(false)
    }
  }

  const editCoupon = (coupon) => {
    setEditingId(getId(coupon))
    setForm({
      code: coupon.code || '',
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue ?? '',
      expiresAt: toDateInputValue(coupon.expiresAt),
      isActive: coupon.isActive !== false,
      maxDiscountAmount: coupon.maxDiscountAmount ?? '',
      minimumOrderAmount: coupon.minimumOrderAmount ?? '',
      perUserLimit: coupon.perUserLimit ?? '1',
      startsAt: toDateInputValue(coupon.startsAt),
      usageLimit: coupon.usageLimit ?? '',
    })
  }

  const deactivateCoupon = async (coupon) => {
    setError('')
    try {
      await adminApi.deleteCoupon(getId(coupon))
      await loadCoupons()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to deactivate coupon.'))
    }
  }

  return (
    <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(28,41,56,0.06)] sm:p-7">
      <div>
        <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-teal-700">Coupons</p>
        <h2 className="m-0 text-3xl font-bold leading-tight text-slate-950">Promotion rules</h2>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}

      <form className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Code" required value={form.code} onChange={(value) => updateField('code', value.toUpperCase())} />
          <label className={labelClass}>
            Discount type
            <select className={inputClass} value={form.discountType} onChange={(event) => updateField('discountType', event.target.value)}>
              <option value="percentage">percentage</option>
              <option value="fixed">fixed</option>
            </select>
          </label>
          <Field label="Discount value" required type="number" value={form.discountValue} onChange={(value) => updateField('discountValue', value)} />
          <Field label="Minimum order" type="number" value={form.minimumOrderAmount} onChange={(value) => updateField('minimumOrderAmount', value)} />
          <Field label="Max discount" type="number" value={form.maxDiscountAmount} onChange={(value) => updateField('maxDiscountAmount', value)} />
          <Field label="Usage limit" type="number" value={form.usageLimit} onChange={(value) => updateField('usageLimit', value)} />
          <Field label="Per-user limit" type="number" value={form.perUserLimit} onChange={(value) => updateField('perUserLimit', value)} />
          <Field label="Starts at" type="date" value={form.startsAt} onChange={(value) => updateField('startsAt', value)} />
          <Field label="Expires at" required type="date" value={form.expiresAt} onChange={(value) => updateField('expiresAt', value)} />
        </div>
        <label className="flex min-h-11 items-center gap-3 font-bold text-slate-700">
          <input checked={form.isActive} type="checkbox" onChange={(event) => updateField('isActive', event.target.checked)} />
          Active coupon
        </label>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-extrabold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-65" disabled={isSaving} type="submit">
            {isSaving && <ButtonSpinner />} {editingId ? 'Update coupon' : 'Create coupon'}
          </button>
          {editingId && (
            <button className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-extrabold text-slate-950 hover:bg-slate-100" type="button" onClick={() => {
              setEditingId('')
              setForm(emptyCoupon)
            }}>
              Cancel edit
            </button>
          )}
        </div>
      </form>

      {isLoading ? (
        <LoadingState label="Loading coupons" variant="table" rows={5} />
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr>
                {['Code', 'Discount', 'Minimum', 'Per user', 'Expires', 'Status', 'Actions'].map((heading) => (
                  <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600" key={heading}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={getId(coupon)}>
                  <td className="border-b border-slate-200 p-3 font-bold">{coupon.code}</td>
                  <td className="border-b border-slate-200 p-3">{coupon.discountType === 'fixed' ? formatMoney(coupon.discountValue) : `${coupon.discountValue}%`}</td>
                  <td className="border-b border-slate-200 p-3">{formatMoney(coupon.minimumOrderAmount)}</td>
                  <td className="border-b border-slate-200 p-3">{coupon.perUserLimit ?? 'Not set'}</td>
                  <td className="border-b border-slate-200 p-3">{formatDate(coupon.expiresAt)}</td>
                  <td className="border-b border-slate-200 p-3">{coupon.isActive === false ? 'Inactive' : 'Active'}</td>
                  <td className="border-b border-slate-200 p-3">
                    <div className="flex flex-wrap gap-2">
                      <button className={smallButtonClass} type="button" onClick={() => editCoupon(coupon)}>Edit</button>
                      <button className={smallButtonClass} type="button" onClick={() => deactivateCoupon(coupon)}>Deactivate</button>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td className="border-b border-slate-200 p-3 text-slate-600" colSpan={7}>No coupons found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const Field = ({ label, onChange, required = false, type = 'text', value }) => (
  <label className={labelClass}>
    {label}
    <input className={inputClass} required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
  </label>
)

const labelClass = 'grid gap-2 text-sm font-extrabold text-slate-700'
const inputClass = 'min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15'
const smallButtonClass = 'inline-flex min-h-8 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-extrabold text-slate-950 hover:bg-slate-50'

const toCouponPayload = (form) => {
  const payload = {
    code: form.code.trim(),
    discountType: form.discountType,
    discountValue: Number(form.discountValue),
    expiresAt: new Date(form.expiresAt).toISOString(),
    isActive: form.isActive,
  }

  if (form.startsAt) payload.startsAt = new Date(form.startsAt).toISOString()
  if (form.minimumOrderAmount !== '') payload.minimumOrderAmount = Number(form.minimumOrderAmount)
  if (form.maxDiscountAmount !== '') payload.maxDiscountAmount = Number(form.maxDiscountAmount)
  if (form.usageLimit !== '') payload.usageLimit = Number(form.usageLimit)
  if (form.perUserLimit !== '') payload.perUserLimit = Number(form.perUserLimit)

  return payload
}

const toDateInputValue = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}
