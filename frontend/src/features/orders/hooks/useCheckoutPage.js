import { useState } from 'react'
import { useNavigate } from 'react-router'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { useCommerce } from '@/features/commerce/hooks/useCommerce'
import { normalizeOrder, SHIPPING_FEE } from '@/features/orders/lib/orderUtils'
import { ordersApi } from '@/features/orders/api/ordersApi'

const emptyAddress = {
  city: '',
  country: 'Sri Lanka',
  phone: '',
  state: '',
  street: '',
  zip: '',
}

export const useCheckoutPage = () => {
  const { cart, isLoading, loadCommerce } = useCommerce()
  const navigate = useNavigate()
  const [billingAddress, setBillingAddress] = useState(emptyAddress)
  const [couponCode, setCouponCode] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const [couponResult, setCouponResult] = useState(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  const [notes, setNotes] = useState('')
  const [shippingAddress, setShippingAddress] = useState(emptyAddress)
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true)

  const discount = Number(readCouponDiscount(couponResult) || cart.discount || cart.discountAmount || 0)
  const total = Math.max(0, Number(cart.subtotal || 0) + SHIPPING_FEE - discount)

  const updateAddress = (setter, name, value) => {
    setter((current) => ({ ...current, [name]: value }))
  }

  const updateCouponCode = (value) => {
    setCouponCode(value)
    setCouponResult(null)
    setCouponMessage('')
  }

  const handleValidateCoupon = async () => {
    setError('')
    setCouponMessage('')
    setCouponResult(null)

    if (!couponCode.trim()) {
      setCouponMessage('Enter a coupon code first.')
      return
    }

    setIsValidatingCoupon(true)
    try {
      const payload = await ordersApi.validateCoupon({
        code: couponCode.trim(),
        cartTotal: Number(cart.subtotal || 0),
      })
      setCouponResult(payload)
      setCouponMessage('Coupon applied.')
    } catch (apiError) {
      setCouponMessage(getApiErrorMessage(apiError, 'Coupon is not valid for this cart.'))
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const payload = buildOrderPayload({
        billingAddress,
        cart,
        couponCode,
        notes,
        shippingAddress,
        useShippingAsBilling,
      })
      const order = normalizeOrder(await ordersApi.createOrder(payload))
      await loadCommerce()
      navigate(`/orders/confirmation/${order?._id || order?.id || order?.orderNumber}`, { replace: true, state: { order } })
    } catch (submitError) {
      setError(submitError?.response ? getApiErrorMessage(submitError, 'Unable to place order.') : submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    billingAddress,
    cart,
    couponCode,
    couponMessage,
    discount,
    error,
    handleSubmit,
    handleValidateCoupon,
    isLoading,
    isSubmitting,
    isValidatingCoupon,
    notes,
    setBillingAddress,
    setNotes,
    setShippingAddress,
    setUseShippingAsBilling,
    shippingAddress,
    total,
    updateAddress,
    updateCouponCode,
    useShippingAsBilling,
  }
}

const buildOrderPayload = ({ billingAddress, cart, couponCode, notes, shippingAddress, useShippingAsBilling }) => {
  if (cart.items.length === 0) throw new Error('Your cart is empty.')

  // Keep validation close to payload creation so checkout rules are easy to find.
  validateAddress(shippingAddress, 'Shipping address')
  if (!useShippingAsBilling) validateAddress(billingAddress, 'Billing address')

  const payload = {
    paymentMethod: 'cod',
    shippingAddress: cleanAddress(shippingAddress),
  }

  if (!useShippingAsBilling) payload.billingAddress = cleanAddress(billingAddress)
  if (couponCode.trim()) payload.couponCode = couponCode.trim()
  if (notes.trim()) payload.notes = notes.trim()

  return payload
}

const validateAddress = (address, label) => {
  const missing = ['street', 'city', 'zip', 'country', 'phone'].filter((field) => !address[field]?.trim())
  if (missing.length > 0) throw new Error(`${label} is missing: ${missing.join(', ')}.`)
}

const cleanAddress = (address) => {
  const clean = {}

  for (const key in address) {
    const value = address[key]
    clean[key] = typeof value === 'string' ? value.trim() : value
  }

  return clean
}

const readCouponDiscount = (payload) =>
  payload?.discountAmount ??
  payload?.discount ??
  payload?.coupon?.discountAmount ??
  payload?.coupon?.discount ??
  payload?.data?.discountAmount ??
  payload?.data?.discount ??
  0
