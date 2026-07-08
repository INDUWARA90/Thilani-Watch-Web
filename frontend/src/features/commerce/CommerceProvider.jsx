import { useCallback, useEffect, useMemo, useState } from 'react'
import { getApiErrorMessage } from '../../lib/apiClient'
import { useAuth } from '../auth/useAuth'
import { getId } from '../storefront/storefrontUtils'
import { commerceApi } from './commerceApi'
import { CommerceContext } from './commerceContextValue'
import { getCartItemWatchId, getStockQuantity, getWishlistWatchId, normalizeCart, normalizeWishlist } from './commerceUtils'

const emptyCart = { items: [], subtotal: 0 }

export const CommerceProvider = ({ children }) => {
  const { isAuthenticated, isRestoring } = useAuth()
  const [cart, setCart] = useState(emptyCart)
  const [wishlist, setWishlist] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pendingIds, setPendingIds] = useState([])

  const setPending = (watchId, isPending) => {
    setPendingIds((current) => (isPending ? [...new Set([...current, watchId])] : current.filter((id) => id !== watchId)))
  }

  const loadCommerce = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(emptyCart)
      setWishlist([])
      return
    }

    setIsLoading(true)
    try {
      const [cartData, wishlistData] = await Promise.all([commerceApi.getCart(), commerceApi.getWishlist()])
      setCart(normalizeCart(cartData))
      setWishlist(normalizeWishlist(wishlistData))
      setError('')
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load cart and wishlist.'))
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const refreshCart = useCallback(async () => {
    const cartData = await commerceApi.getCart()
    setCart(normalizeCart(cartData))
  }, [])

  const refreshWishlist = useCallback(async () => {
    const wishlistData = await commerceApi.getWishlist()
    setWishlist(normalizeWishlist(wishlistData))
  }, [])

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      if (isRestoring) return

      if (!isAuthenticated) {
        if (isMounted) {
          setCart(emptyCart)
          setWishlist([])
        }
        return
      }

      setIsLoading(true)
      try {
        const [cartData, wishlistData] = await Promise.all([commerceApi.getCart(), commerceApi.getWishlist()])
        if (isMounted) {
          setCart(normalizeCart(cartData))
          setWishlist(normalizeWishlist(wishlistData))
          setError('')
        }
      } catch (apiError) {
        if (isMounted) {
          setError(getApiErrorMessage(apiError, 'Unable to load cart and wishlist.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, isRestoring])

  const addToCart = useCallback(async (watch, quantity = 1) => {
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
      const message = getApiErrorMessage(apiError, 'Unable to add this watch to cart.')
      setError(message)
      throw new Error(message, { cause: apiError })
    } finally {
      setPending(watchId, false)
    }
  }, [refreshCart])

  const updateCartQuantity = useCallback(async (item, quantity) => {
    const watch = item?.watch || item
    const watchId = getCartItemWatchId(item)
    const nextQuantity = Number(quantity || 1)
    const stockQuantity = getStockQuantity(watch)
    const previousCart = cart

    if (nextQuantity < 1) throw new Error('Quantity must be at least 1.')
    if (stockQuantity > 0 && nextQuantity > stockQuantity) {
      throw new Error(`Only ${stockQuantity} available in stock.`)
    }

    setPending(watchId, true)
    // Quantity updates are safe to show optimistically because we can restore the previous cart.
    setCart((current) => {
      const items = current.items.map((cartItem) => (getCartItemWatchId(cartItem) === watchId ? { ...cartItem, quantity: nextQuantity } : cartItem))
      const subtotal = items.reduce((total, cartItem) => {
        const itemWatch = cartItem.watch || cartItem.product || cartItem
        const price = Number(cartItem.priceAtTime ?? itemWatch.price ?? 0)
        return total + price * Number(cartItem.quantity || 1)
      }, 0)

      return { ...current, items, subtotal }
    })
    try {
      await commerceApi.updateCartItem(watchId, nextQuantity)
      await refreshCart()
      setError('')
    } catch (apiError) {
      setCart(previousCart)
      const message = getApiErrorMessage(apiError, 'Unable to update cart quantity.')
      setError(message)
      throw new Error(message, { cause: apiError })
    } finally {
      setPending(watchId, false)
    }
  }, [cart, refreshCart])

  const removeFromCart = useCallback(async (item) => {
    const watchId = getCartItemWatchId(item)
    setPending(watchId, true)
    try {
      await commerceApi.removeCartItem(watchId)
      await refreshCart()
      setError('')
    } catch (apiError) {
      const message = getApiErrorMessage(apiError, 'Unable to remove this item.')
      setError(message)
      throw new Error(message, { cause: apiError })
    } finally {
      setPending(watchId, false)
    }
  }, [refreshCart])

  const clearCart = useCallback(async () => {
    try {
      await commerceApi.clearCart()
      await refreshCart()
      setError('')
    } catch (apiError) {
      const message = getApiErrorMessage(apiError, 'Unable to clear cart.')
      setError(message)
      throw new Error(message, { cause: apiError })
    }
  }, [refreshCart])

  const isWishlisted = useCallback(
    (watchId) => wishlist.some((item) => getWishlistWatchId(item) === watchId),
    [wishlist],
  )

  const toggleWishlist = useCallback(async (watch) => {
    const watchId = getId(watch)
    if (!watchId) throw new Error('Watch is missing an ID.')

    const wasWishlisted = wishlist.some((item) => getWishlistWatchId(item) === watchId)
    setPending(watchId, true)
    setWishlist((current) => (wasWishlisted ? current.filter((item) => getWishlistWatchId(item) !== watchId) : [...current, watch]))

    try {
      if (wasWishlisted) {
        await commerceApi.removeWishlistItem(watchId)
      } else {
        await commerceApi.addWishlistItem(watchId)
      }
      await refreshWishlist()
      setError('')
    } catch (apiError) {
      await loadCommerce()
      const message = getApiErrorMessage(apiError, 'Unable to update wishlist.')
      setError(message)
      throw new Error(message, { cause: apiError })
    } finally {
      setPending(watchId, false)
    }
  }, [loadCommerce, refreshWishlist, wishlist])

  const value = useMemo(
    () => ({
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
    }),
    [addToCart, cart, clearCart, error, isLoading, isWishlisted, loadCommerce, pendingIds, removeFromCart, toggleWishlist, updateCartQuantity, wishlist],
  )

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>
}
