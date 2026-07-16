import { useCallback, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getId } from '@/features/storefront/lib/storefrontUtils'
import { commerceApi } from '@/features/commerce/api/commerceApi'
import { CommerceContext } from './commerceContextValue'
import { getCartItemWatchId, getStockQuantity, getWishlistWatchId, normalizeCart, normalizeWishlist } from '@/features/commerce/lib/commerceUtils'

const emptyCart = { items: [], subtotal: 0 }
const commerceKeys = {
  cart: ['commerce', 'cart'],
  wishlist: ['commerce', 'wishlist'],
}

export const CommerceProvider = ({ children }) => {
  const { isAuthenticated, isRestoring } = useAuth()
  const [error, setError] = useState('')
  const [pendingIds, setPendingIds] = useState([])
  const queryClient = useQueryClient()

  const cartQuery = useQuery({
    enabled: !isRestoring && isAuthenticated,
    initialData: emptyCart,
    queryFn: async () => normalizeCart(await commerceApi.getCart()),
    queryKey: commerceKeys.cart,
  })

  const wishlistQuery = useQuery({
    enabled: !isRestoring && isAuthenticated,
    initialData: [],
    queryFn: async () => normalizeWishlist(await commerceApi.getWishlist()),
    queryKey: commerceKeys.wishlist,
  })

  const cart = useMemo(() => (isAuthenticated ? cartQuery.data : emptyCart), [cartQuery.data, isAuthenticated])
  const wishlist = useMemo(() => (isAuthenticated ? wishlistQuery.data : []), [isAuthenticated, wishlistQuery.data])
  const isLoading = cartQuery.isFetching || wishlistQuery.isFetching

  const setPending = (watchId, isPending) => {
    setPendingIds((current) => (isPending ? [...new Set([...current, watchId])] : current.filter((id) => id !== watchId)))
  }

  const loadCommerce = useCallback(async () => {
    if (!isAuthenticated) {
      queryClient.setQueryData(commerceKeys.cart, emptyCart)
      queryClient.setQueryData(commerceKeys.wishlist, [])
      return
    }

    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: commerceKeys.cart }),
        queryClient.invalidateQueries({ queryKey: commerceKeys.wishlist }),
      ])
      setError('')
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load cart and wishlist.'))
    }
  }, [isAuthenticated, queryClient])

  const refreshCart = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: commerceKeys.cart })
  }, [queryClient])

  const refreshWishlist = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: commerceKeys.wishlist })
  }, [queryClient])

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
    queryClient.setQueryData(commerceKeys.cart, (current = emptyCart) => {
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
      queryClient.setQueryData(commerceKeys.cart, previousCart)
      const message = getApiErrorMessage(apiError, 'Unable to update cart quantity.')
      setError(message)
      throw new Error(message, { cause: apiError })
    } finally {
      setPending(watchId, false)
    }
  }, [cart, queryClient, refreshCart])

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
    queryClient.setQueryData(commerceKeys.wishlist, (current = []) => (wasWishlisted ? current.filter((item) => getWishlistWatchId(item) !== watchId) : [...current, watch]))

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
  }, [loadCommerce, queryClient, refreshWishlist, wishlist])

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
