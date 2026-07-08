import { formatMoney, getId, getTitle } from '@/features/storefront/lib/storefrontUtils'

export const SHIPPING_FEE = 500

export const normalizeOrder = (payload) => payload?.order || payload

export const normalizeOrders = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.orders)) return payload.orders
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

export const getOrderId = (order) => getId(order)

export const getOrderTotal = (order) => order?.totalAmount ?? order?.total ?? order?.grandTotal ?? 0

export const getOrderSubtotal = (order) => order?.subtotal ?? order?.itemsTotal ?? 0

export const getOrderStatus = (order) => order?.orderStatus || order?.status || 'pending'

export const getPaymentStatus = (order) => order?.paymentStatus || 'pending'

export const canCancelOrder = (order) => ['pending', 'confirmed'].includes(getOrderStatus(order))

export const formatDate = (value) => {
  if (!value) return 'Not set'

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export const formatOrderMoney = (amount, currency = 'LKR') => formatMoney(amount, currency)

export const getOrderItemName = (item) => item?.name || getTitle(item?.watch || item?.product, 'Watch')

export const getOrderItemPrice = (item) => item?.price ?? item?.priceAtTime ?? item?.unitPrice ?? item?.watch?.price ?? 0
