import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { cloudinaryApi } from '@/shared/api/cloudinaryApi'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { useCommerce } from '@/features/commerce/hooks/useCommerce'
import { getShippingFeeByProvince, normalizeOrder } from '@/features/orders/lib/orderUtils'
import { ordersApi } from '@/features/orders/api/ordersApi'

const emptyAddress = {
  city: '',
  country: 'Sri Lanka',
  phone: '',
  state: '',
  street: '',
  zip: '',
}

const MAX_PAYMENT_SLIP_SIZE = 5 * 1024 * 1024

export const useCheckoutPage = () => {
  const { cart, isLoading, isRestoring, loadCommerce } = useCommerce()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [billingAddress, setBillingAddress] = useState(emptyAddress)
  const [couponCode, setCouponCode] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const [couponResult, setCouponResult] = useState(null)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [touchedFields, setTouchedFields] = useState({})
  const [notes, setNotes] = useState('')
  const [paymentSlipFile, setPaymentSlipFile] = useState(null)
  const [paymentSlipPreview, setPaymentSlipPreview] = useState('')
  const [isPaymentSlipPopupOpen, setIsPaymentSlipPopupOpen] = useState(false)
  const [shippingAddress, setShippingAddress] = useState(emptyAddress)
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true)
  const [wantedDate, setWantedDate] = useState('')
  const minimumWantedDate = getMinimumWantedDate()

  const discount = readCouponDiscount(couponResult, cart.subtotal) || Number(cart.discount || cart.discountAmount || 0)
  const shippingFee = getShippingFeeByProvince(shippingAddress.state)
  const total = Math.max(0, Number(cart.subtotal || 0) + shippingFee - discount)
  const couponMutation = useMutation({
    mutationFn: ordersApi.validateCoupon,
    onSuccess: (payload) => {
      setCouponResult(payload)
      setCouponMessage('Coupon applied.')
    },
    onError: (apiError) => {
      setCouponMessage(getApiErrorMessage(apiError, 'Coupon is not valid for this cart.'))
    },
  })
  const orderMutation = useMutation({
    mutationFn: async (payload) => {
      const paymentSlip = await cloudinaryApi.uploadPaymentSlip(paymentSlipFile)
      return normalizeOrder(await ordersApi.createOrder({ ...payload, paymentSlip }))
    },
    onSuccess: async (order) => {
      await Promise.all([
        loadCommerce(),
        queryClient.invalidateQueries({ queryKey: ['orders', 'mine'] }),
      ])
      navigate(`/orders/confirmation/${order?._id || order?.id || order?.orderNumber}`, { replace: true, state: { order } })
    },
    onError: (submitError) => {
      setError(submitError?.response ? getApiErrorMessage(submitError, 'Unable to place order.') : submitError.message)
    },
  })

  const updateAddress = (setter, name, value, addressType = 'shipping') => {
    const fieldKey = `${addressType}.${name}`

    setter((current) => ({ ...current, [name]: value }))
    setTouchedFields((current) => ({ ...current, [fieldKey]: true }))
    setFieldErrors((current) => ({ ...current, [fieldKey]: validateAddressField(name, value) }))
  }

  const markAddressFieldTouched = (addressType, name, value) => {
    const fieldKey = `${addressType}.${name}`

    setTouchedFields((current) => ({ ...current, [fieldKey]: true }))
    setFieldErrors((current) => ({ ...current, [fieldKey]: validateAddressField(name, value) }))
  }

  const updateWantedDate = (value) => {
    setWantedDate(value)
    setTouchedFields((current) => ({ ...current, wantedDate: true }))
    setFieldErrors((current) => ({ ...current, wantedDate: validateWantedDate(value) }))
  }

  const updateCouponCode = (value) => {
    setCouponCode(value)
    setCouponResult(null)
    setCouponMessage('')
  }

  const updatePaymentSlipFile = (file) => {
    setError('')

    if (!file) {
      setPaymentSlipFile(null)
      setPaymentSlipPreview('')
      return
    }

    if (file.size > MAX_PAYMENT_SLIP_SIZE) {
      setPaymentSlipFile(null)
      setPaymentSlipPreview('')
      setError('Payment slip file must be 5MB or smaller.')
      setTouchedFields((current) => ({ ...current, paymentSlip: true }))
      setFieldErrors((current) => ({ ...current, paymentSlip: 'Payment slip file must be 5MB or smaller.' }))
      return
    }

    setPaymentSlipFile(file)
    setPaymentSlipPreview('')
    setIsPaymentSlipPopupOpen(false)
    setTouchedFields((current) => ({ ...current, paymentSlip: true }))
    setFieldErrors((current) => ({ ...current, paymentSlip: '' }))
  }

  const removePaymentSlipFile = () => {
    setPaymentSlipFile(null)
    setPaymentSlipPreview('')
    setTouchedFields((current) => ({ ...current, paymentSlip: true }))
    setFieldErrors((current) => ({ ...current, paymentSlip: 'Please attach your bank transfer payment slip.' }))
  }

  useEffect(() => {
    if (!paymentSlipFile || !paymentSlipFile.type.startsWith('image/')) return undefined

    let isActive = true
    const reader = new FileReader()

    reader.onload = () => {
      if (isActive) setPaymentSlipPreview(String(reader.result || ''))
    }
    reader.readAsDataURL(paymentSlipFile)

    return () => {
      isActive = false
    }
  }, [paymentSlipFile])

  const handleValidateCoupon = async () => {
    setError('')
    setCouponMessage('')
    setCouponResult(null)

    if (!couponCode.trim()) {
      setCouponMessage('Enter a coupon code first.')
      return
    }

    await couponMutation.mutateAsync({
      code: couponCode.trim(),
      cartTotal: Number(cart.subtotal || 0),
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const checkoutErrors = validateCheckoutForm({
      billingAddress,
      paymentSlipFile,
      shippingAddress,
      useShippingAsBilling,
      wantedDate,
    })

    if (hasValidationErrors(checkoutErrors)) {
      setTouchedFields(markErrorsTouched(checkoutErrors))
      setFieldErrors(checkoutErrors)
      setError('Please correct the highlighted checkout fields before placing your order.')
      return
    }

    if (!paymentSlipFile) {
      setIsPaymentSlipPopupOpen(true)
      setError('Please attach your bank transfer payment slip before placing the order.')
      return
    }

    await orderMutation.mutateAsync(buildOrderPayload({
      billingAddress,
      cart,
      couponCode,
      notes,
      paymentSlipFile,
      shippingFee,
      shippingAddress,
      useShippingAsBilling,
      wantedDate,
    }))
  }

  return {
    billingAddress,
    cart,
    couponCode,
    couponMessage,
    discount,
    error,
    fieldErrors,
    handleSubmit,
    handleValidateCoupon,
    isLoading,
    isPaymentSlipPopupOpen,
    minimumWantedDate,
    isSessionRestoring: isRestoring || isLoading,
    isSubmitting: orderMutation.isPending,
    isValidatingCoupon: couponMutation.isPending,
    notes,
    paymentSlipFile,
    paymentSlipPreview,
    removePaymentSlipFile,
    markAddressFieldTouched,
    setIsPaymentSlipPopupOpen,
    setBillingAddress,
    setNotes,
    setShippingAddress,
    setUseShippingAsBilling,
    shippingAddress,
    shippingFee,
    touchedFields,
    total,
    updateAddress,
    updateCouponCode,
    updatePaymentSlipFile,
    useShippingAsBilling,
    wantedDate,
    setWantedDate: updateWantedDate,
  }
}

const buildOrderPayload = ({ billingAddress, cart, couponCode, notes, paymentSlipFile, shippingAddress, shippingFee, useShippingAsBilling, wantedDate }) => {
  if (cart.items.length === 0) throw new Error('Your cart is empty.')
  if (!paymentSlipFile) throw new Error('Please attach your payment slip before placing the order.')

  // Keep validation close to payload creation so checkout rules are easy to find.
  validateAddress(shippingAddress, 'Shipping address')
  if (!useShippingAsBilling) validateAddress(billingAddress, 'Billing address')

  const payload = {
    paymentMethod: 'bank_transfer',
    shippingFee,
    shippingAddress: cleanAddress(shippingAddress),
  }

  if (!useShippingAsBilling) payload.billingAddress = cleanAddress(billingAddress)
  if (couponCode.trim()) payload.couponCode = couponCode.trim()
  if (notes.trim()) payload.notes = notes.trim()
  if (wantedDate) payload.wantedDate = wantedDate

  return payload
}

const validateAddress = (address, label) => {
  const missing = requiredAddressFields.filter((field) => !address[field]?.trim())
  if (missing.length > 0) throw new Error(`${label} is missing: ${missing.join(', ')}.`)
}

const requiredAddressFields = ['street', 'city', 'state', 'zip', 'country', 'phone']

const addressFieldLabels = {
  city: 'City',
  country: 'Country',
  phone: 'Phone number',
  state: 'Province',
  street: 'Street address',
  zip: 'ZIP / Postal code',
}

const validateAddressField = (name, value) => {
  const normalized = String(value || '').trim()
  const label = addressFieldLabels[name] || 'This field'

  if (requiredAddressFields.includes(name) && !normalized) return `${label} is required.`
  if (name === 'phone' && normalized && !/^[+()\d\s-]{7,20}$/.test(normalized)) return 'Enter a valid phone number.'
  if (name === 'zip' && normalized && normalized.length < 3) return 'Enter a valid postal code.'
  if (['city', 'country', 'state'].includes(name) && normalized && normalized.length < 2) return `${label} is too short.`
  if (name === 'street' && normalized && normalized.length < 5) return 'Enter a complete street address.'

  return ''
}

const validateWantedDate = (value) => {
  if (!value) return ''

  const selectedDate = new Date(`${value}T00:00:00`)
  const minimumDate = new Date(`${getMinimumWantedDate()}T00:00:00`)

  if (Number.isNaN(selectedDate.getTime())) return 'Enter a valid delivery date.'
  if (selectedDate < minimumDate) return 'Wanted delivery date must be at least 2 days from today.'
  return ''
}

const getMinimumWantedDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 2)
  date.setHours(0, 0, 0, 0)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const validateAddressFields = (address, addressType) =>
  requiredAddressFields.reduce((errors, field) => {
    errors[`${addressType}.${field}`] = validateAddressField(field, address[field])
    return errors
  }, {})

const validateCheckoutForm = ({ billingAddress, paymentSlipFile, shippingAddress, useShippingAsBilling, wantedDate }) => ({
  ...validateAddressFields(shippingAddress, 'shipping'),
  ...(!useShippingAsBilling ? validateAddressFields(billingAddress, 'billing') : {}),
  paymentSlip: paymentSlipFile ? '' : 'Please attach your bank transfer payment slip.',
  wantedDate: validateWantedDate(wantedDate),
})

const hasValidationErrors = (errors) => Object.values(errors).some(Boolean)

const markErrorsTouched = (errors) =>
  Object.keys(errors).reduce((touched, key) => {
    touched[key] = true
    return touched
  }, {})

const cleanAddress = (address) => {
  const clean = {}

  for (const key in address) {
    const value = address[key]
    clean[key] = typeof value === 'string' ? value.trim() : value
  }

  return clean
}

const readCouponDiscount = (payload, subtotal = 0) => {
  const directDiscount =
    payload?.discountAmount ??
    payload?.discount ??
    payload?.coupon?.discountAmount ??
    payload?.coupon?.discount ??
    payload?.data?.discountAmount ??
    payload?.data?.discount

  if (directDiscount !== undefined && directDiscount !== null) {
    return normalizeDiscountAmount(directDiscount, subtotal)
  }

  const coupon = payload?.coupon || payload?.data?.coupon || payload?.data || payload
  return calculateCouponDiscount(coupon, subtotal)
}

const calculateCouponDiscount = (coupon, subtotal = 0) => {
  if (!coupon?.discountType || coupon.discountValue === undefined || coupon.discountValue === null) return 0

  const normalizedSubtotal = Number(subtotal || 0)
  const discountValue = Number(coupon.discountValue || 0)
  let discount = coupon.discountType === 'percentage' ? (normalizedSubtotal * discountValue) / 100 : discountValue

  if (coupon.maxDiscountAmount) discount = Math.min(discount, Number(coupon.maxDiscountAmount))
  return normalizeDiscountAmount(discount, normalizedSubtotal)
}

const normalizeDiscountAmount = (value, subtotal = 0) => {
  const amount = Number(value || 0)
  if (!Number.isFinite(amount) || amount <= 0) return 0
  return Math.min(amount, Number(subtotal || 0))
}
