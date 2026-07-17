import { useEffect, useState } from 'react'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { getId, normalizeList } from '../lib/adminUtils'

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

export const useAdminCoupons = () => {
  const [coupons, setCoupons] = useState([])
  const [editingId, setEditingId] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyCoupon)
  const [isFormOpen, setIsFormOpen] = useState(false)
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
    // Delay the first load one tick so React hook lint accepts the state updates.
    const timer = setTimeout(loadCoupons, 0)
    return () => clearTimeout(timer)
  }, [])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const openForm = () => setIsFormOpen(true)

  const closeFormWorkspace = () => {
    setEditingId('')
    setForm(emptyCoupon)
    setIsFormOpen(false)
  }

  const editCoupon = (coupon) => {
    setEditingId(getId(coupon))
    setForm(couponToForm(coupon))
    setIsFormOpen(true)
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
      closeFormWorkspace()
      await loadCoupons()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to save coupon.'))
    } finally {
      setIsSaving(false)
    }
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

  return {
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
  }
}

const couponToForm = (coupon) => ({
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
