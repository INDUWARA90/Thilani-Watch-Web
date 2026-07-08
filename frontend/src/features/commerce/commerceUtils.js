import { getId } from '../storefront/storefrontUtils'

export const normalizeCart = (payload) => {
  const cart = payload?.cart || payload
  const items = Array.isArray(cart?.items) ? cart.items : []

  return {
    ...cart,
    items,
    subtotal: Number(cart?.subtotal || 0),
  }
}

export const normalizeWishlist = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.wishlist)) return payload.wishlist
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.watches)) return payload.watches
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

export const getCartItemWatch = (item) => item?.watch || item?.product || item

export const getCartItemWatchId = (item) => getId(getCartItemWatch(item))

export const getWishlistWatch = (item) => item?.watch || item?.product || item

export const getWishlistWatchId = (item) => getId(getWishlistWatch(item))

export const getStockQuantity = (watch) => {
  if (typeof watch?.stockQuantity === 'number') return watch.stockQuantity
  if (watch?.inStock) return 99
  return 0
}
