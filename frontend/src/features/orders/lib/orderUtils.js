import { formatMoney, getId, getTitle, normalizeList } from '@/features/storefront/lib/storefrontUtils'

export const SHIPPING_FEE = 500

export const normalizeOrder = (payload) => payload?.order ?? payload

export const normalizeOrders = (payload) => normalizeList(payload, ['orders'])

export const getOrderId = (order) => getId(order)

export const getOrderTotal = (order) => order?.total ?? 0

export const getOrderSubtotal = (order) => order?.subtotal ?? 0

export const getOrderStatus = (order) => order?.orderStatus ?? 'pending'

export const getPaymentStatus = (order) => order?.paymentStatus ?? 'pending'

export const getPaymentMethodLabel = (method) => {
  const normalized = String(method || '').toLowerCase()
  if (normalized === 'bank_transfer') return 'Bank transfer'
  if (normalized === 'cod') return 'Cash on delivery'
  if (!normalized) return 'Not set'
  return normalized.replaceAll('_', ' ')
}

export const getPaymentSlip = (order) => {
  const directSlip = order?.paymentSlip || order?.payment?.slip || order?.paymentProof
  const directUrl = directSlip?.url || directSlip?.secureUrl || directSlip?.secure_url
  const fallbackUrl = order?.paymentSlipUrl || order?.paymentProofUrl || order?.slipUrl

  if (directUrl) {
    return {
      publicId: directSlip.publicId || directSlip.public_id || order?.paymentSlipPublicId || '',
      url: directUrl,
    }
  }

  if (fallbackUrl) {
    return {
      publicId: order?.paymentSlipPublicId || order?.paymentProofPublicId || '',
      url: fallbackUrl,
    }
  }

  return null
}

export const canCancelOrder = (order) => ['pending', 'confirmed'].includes(getOrderStatus(order).toLowerCase())

export const formatDate = (value) => {
  if (!value) return 'Not set'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not set'

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export const formatOrderMoney = (amount, currency = 'LKR') => formatMoney(amount, currency)

export const getOrderItemName = (item) => item?.name || getTitle(item?.watch || item?.product, 'Watch')

export const getOrderItemPrice = (item) => item?.price ?? item?.priceAtTime ?? 0
