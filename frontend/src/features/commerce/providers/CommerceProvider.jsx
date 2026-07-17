import { useCallback, useEffect, useState } from 'react'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getId } from '@/features/storefront/lib/storefrontUtils'
import { commerceApi } from '@/features/commerce/api/commerceApi'
import { CommerceContext } from './commerceContextValue'
import { getCartItemWatchId, getStockQuantity, getWishlistWatchId, normalizeCart, normalizeWishlist } from '@/features/commerce/lib/commerceUtils'

const emptyCart = { items: [], subtotal: 0 }

export const CommerceProvider = ({ children }) => {
  const { isAuthenticated, isRestoring } = useAuth()
  const [cart, setCart] = useState(emptyCart)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pendingIds, setPendingIds] = useState([])
  const [wishlist, setWishlist] = useState([])

  const setPending = (watchId, isPending) => {
    setPendingIds((current) => {
      if (!isPending) return current.filter((id) => id !== watchId)
      if (current.includes(watchId)) return current
      return [...current, watchId]
    })
  }

  const refreshCart = async () => {
    if (!isAuthenticated) return setCart(emptyCart)
    setCart(normalizeCart(await commerceApi.getCart()))
  }

  const refreshWishlist = async () => {
    if (!isAuthenticated) return setWishlist([])
    setWishlist(normalizeWishlist(await commerceApi.getWishlist()))
  }

  const handleActionError = (apiError, fallbackMessage) => {
    const message = getApiErrorMessage(apiError, fallbackMessage)
    setError(message)
    throw new Error(message, { cause: apiError })
  }

  const loadCommerce = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(emptyCart)
      setWishlist([])
      return
    }

    setIsLoading(true)
    try {
      const [cartPayload, wishlistPayload] = await Promise.all([commerceApi.getCart(), commerceApi.getWishlist()])
      setCart(normalizeCart(cartPayload))
      setWishlist(normalizeWishlist(wishlistPayload))
      setError('')
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load cart and wishlist.'))
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isRestoring) return
    // Delay the first load one tick so React hook lint accepts the state updates.
    const timer = setTimeout(loadCommerce, 0)
    return () => clearTimeout(timer)
  }, [isRestoring, loadCommerce])

  const addToCart = async (watch, quantity = 1) => {
    const watchId = getId(watch)
    const requestedQuantity = Number(quantity || 1)
    const stockQuantity = getStockQuantity(watch)

    if (!watchId) throw new Error('Watch is missing an ID.')
    if (requestedQuantity < 1) throw new Error('Choose at least one item.')
    if (stockQuantity > 0 && requestedQuantity > stockQuantity) {
      throw new Error(`Only ${stockQuantity} available in stock.`)
    }

    setPending(watchId, true)
    try {
      await commerceApi.addCartItem(watchId, requestedQuantity)
      await refreshCart()
      setError('')
    } catch (apiError) {
      handleActionError(apiError, 'Unable to add this watch to cart.')
    } finally {
      setPending(watchId, false)
    }
  }

  const updateCartQuantity = async (item, quantity) => {
    const watch = item?.watch || item
    const watchId = getCartItemWatchId(item)
    const nextQuantity = Number(quantity || 1)
    const stockQuantity = getStockQuantity(watch)

    if (!watchId) throw new Error('Cart item is missing an ID.')
    if (nextQuantity < 1) throw new Error('Quantity must be at least 1.')
    if (stockQuantity > 0 && nextQuantity > stockQuantity) {
      throw new Error(`Only ${stockQuantity} available in stock.`)
    }

    setPending(watchId, true)
    try {
      await commerceApi.updateCartItem(watchId, nextQuantity)
      await refreshCart()
      setError('')
    } catch (apiError) {
      handleActionError(apiError, 'Unable to update cart quantity.')
    } finally {
      setPending(watchId, false)
    }
  }

  const removeFromCart = async (item) => {
    const watchId = getCartItemWatchId(item)
    if (!watchId) throw new Error('Cart item is missing an ID.')

    setPending(watchId, true)
    try {
      await commerceApi.removeCartItem(watchId)
      await refreshCart()
      setError('')
    } catch (apiError) {
      handleActionError(apiError, 'Unable to remove this item.')
    } finally {
      setPending(watchId, false)
    }
  }

  const clearCart = async () => {
    try {
      await commerceApi.clearCart()
      await refreshCart()
      setError('')
    } catch (apiError) {
      handleActionError(apiError, 'Unable to clear cart.')
    }
  }

  const isWishlisted = (watchId) => wishlist.some((item) => getWishlistWatchId(item) === watchId)

  const toggleWishlist = async (watch) => {
    const watchId = getId(watch)
    if (!watchId) throw new Error('Watch is missing an ID.')

    const wasWishlisted = isWishlisted(watchId)
    setPending(watchId, true)
    try {
      if (wasWishlisted) {
        await commerceApi.removeWishlistItem(watchId)
      } else {
        await commerceApi.addWishlistItem(watchId)
      }
      await refreshWishlist()
      setError('')
    } catch (apiError) {
      handleActionError(apiError, 'Unable to update wishlist.')
    } finally {
      setPending(watchId, false)
    }
  }

  const value = {
    addToCart,
    cart,
    clearCart,
    error,
    isLoading,
    isPending: (watchId) => pendingIds.includes(watchId),
    isWishlisted,
    loadCommerce,
    removeFromCart,
    toggleWishlist,
    updateCartQuantity,
    wishlist,
  }

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>
}
