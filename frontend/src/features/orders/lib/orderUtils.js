import { formatMoney, getId, getTitle, normalizeList } from '@/features/storefront/lib/storefrontUtils'

export const SHIPPING_FEE = 500

export const normalizeOrder = (payload) => payload?.order ?? payload

export const normalizeOrders = (payload) => normalizeList(payload, ['orders'])

export const getOrderId = (order) => getId(order)

export const getOrderTotal = (order) => order?.total ?? 0

export const getOrderSubtotal = (order) => order?.subtotal ?? 0

export const getOrderStatus = (order) => order?.orderStatus ?? 'pending'

export const getPaymentStatus = (order) => order?.paymentStatus ?? 'pending'

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
