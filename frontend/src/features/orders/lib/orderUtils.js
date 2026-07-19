import { formatMoney, getId, getTitle, normalizeList } from '@/features/storefront/lib/storefrontUtils'

export const SRI_LANKA_PROVINCES = [
  'Western Province',
  'Central Province',
  'Southern Province',
  'Northern Province',
  'Eastern Province',
  'North Western Province',
  'North Central Province',
  'Uva Province',
  'Sabaragamuwa Province',
]

export const WESTERN_PROVINCE_SHIPPING_FEE = 400

export const OUTSTATION_SHIPPING_FEE = 450

export const SHIPPING_FEE = OUTSTATION_SHIPPING_FEE

export const getShippingFeeByProvince = (province) =>
  province === 'Western Province' ? WESTERN_PROVINCE_SHIPPING_FEE : OUTSTATION_SHIPPING_FEE

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
      fileName: directSlip.fileName || directSlip.originalFilename || directSlip.original_filename || '',
      format: directSlip.format || '',
      publicId: directSlip.publicId || directSlip.public_id || order?.paymentSlipPublicId || '',
      resourceType: directSlip.resourceType || directSlip.resource_type || '',
      url: directUrl,
    }
  }

  if (fallbackUrl) {
    return {
      fileName: '',
      format: '',
      publicId: order?.paymentSlipPublicId || order?.paymentProofPublicId || '',
      resourceType: '',
      url: fallbackUrl,
    }
  }

  return null
}

export const isPaymentSlipImage = (paymentSlip) => {
  if (!paymentSlip?.url) return false
  if (paymentSlip.resourceType === 'image') return true
  if (paymentSlip.resourceType && paymentSlip.resourceType !== 'image') return false

  return /\.(avif|gif|jpe?g|png|webp)(\?|#|$)/i.test(paymentSlip.url)
}

export const canCancelOrder = (order) => getOrderStatus(order).toLowerCase() === 'pending'

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
