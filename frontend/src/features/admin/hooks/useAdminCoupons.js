import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
  const [editingId, setEditingId] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyCoupon)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const queryClient = useQueryClient()
  const couponsQuery = useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: adminApi.getCoupons,
    select: (payload) => normalizeList(payload, ['coupons']),
  })
  const saveCouponMutation = useMutation({
    mutationFn: ({ id, payload }) => (id ? adminApi.updateCoupon(id, payload) : adminApi.createCoupon(payload)),
    onSuccess: async () => {
      closeFormWorkspace()
      await queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
    },
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, 'Unable to save coupon.'))
    },
  })
  const deactivateCouponMutation = useMutation({
    mutationFn: (coupon) => adminApi.deleteCoupon(getId(coupon)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
    },
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, 'Unable to deactivate coupon.'))
    },
  })

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
    await saveCouponMutation.mutateAsync({ id: editingId, payload: toCouponPayload(form) })
  }

  const deactivateCoupon = async (coupon) => {
    setError('')
    await deactivateCouponMutation.mutateAsync(coupon)
  }

  const loadError = couponsQuery.error ? getApiErrorMessage(couponsQuery.error, 'Unable to load coupons.') : ''

  return {
    closeFormWorkspace,
    coupons: couponsQuery.data ?? [],
    deactivateCoupon,
    editCoupon,
    editingId,
    error: error || loadError,
    form,
    handleSubmit,
    isFormOpen,
    isLoading: couponsQuery.isLoading,
    isSaving: saveCouponMutation.isPending,
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
