import { useCallback, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getId } from '@/features/storefront/lib/storefrontUtils'
import { commerceApi } from '@/features/commerce/api/commerceApi'
import { CommerceContext } from './commerceContextValue'
import { getCartItemWatchId, getStockQuantity, getWishlistWatchId, normalizeCart, normalizeWishlist } from '@/features/commerce/lib/commerceUtils'

const emptyCart = { items: [], subtotal: 0 }

export const CommerceProvider = ({ children }) => {
  const { isAuthenticated, isRestoring } = useAuth()
  const [error, setError] = useState('')
  const [pendingIds, setPendingIds] = useState([])
  const queryClient = useQueryClient()
  const canLoadCommerce = isAuthenticated && !isRestoring
  const cartQuery = useQuery({
    enabled: canLoadCommerce,
    queryKey: ['commerce', 'cart'],
    queryFn: commerceApi.getCart,
    select: normalizeCart,
  })
  const wishlistQuery = useQuery({
    enabled: canLoadCommerce,
    queryKey: ['commerce', 'wishlist'],
    queryFn: commerceApi.getWishlist,
    select: normalizeWishlist,
  })
  const cart = canLoadCommerce ? cartQuery.data ?? emptyCart : emptyCart
  const wishlist = canLoadCommerce ? wishlistQuery.data ?? [] : []

  const setPending = (watchId, isPending) => {
    setPendingIds((current) => {
      if (!isPending) return current.filter((id) => id !== watchId)
      if (current.includes(watchId)) return current
      return [...current, watchId]
    })
  }

  const refreshCart = useCallback(async () => {
    if (!canLoadCommerce) return
    await queryClient.invalidateQueries({ queryKey: ['commerce', 'cart'] })
  }, [canLoadCommerce, queryClient])

  const refreshWishlist = useCallback(async () => {
    if (!canLoadCommerce) return
    await queryClient.invalidateQueries({ queryKey: ['commerce', 'wishlist'] })
  }, [canLoadCommerce, queryClient])

  const handleActionError = (apiError, fallbackMessage) => {
    const message = getApiErrorMessage(apiError, fallbackMessage)
    setError(message)
    throw new Error(message, { cause: apiError })
  }

  const loadCommerce = useCallback(async () => {
    if (!canLoadCommerce) return
    await Promise.all([cartQuery.refetch(), wishlistQuery.refetch()])
  }, [canLoadCommerce, cartQuery, wishlistQuery])
  const addCartMutation = useMutation({
    mutationFn: ({ watchId, quantity }) => commerceApi.addCartItem(watchId, quantity),
    onSuccess: refreshCart,
  })
  const updateCartMutation = useMutation({
    mutationFn: ({ watchId, quantity }) => commerceApi.updateCartItem(watchId, quantity),
    onSuccess: refreshCart,
  })
  const removeCartMutation = useMutation({
    mutationFn: (watchId) => commerceApi.removeCartItem(watchId),
    onSuccess: refreshCart,
  })
  const clearCartMutation = useMutation({
    mutationFn: commerceApi.clearCart,
    onSuccess: refreshCart,
  })
  const wishlistMutation = useMutation({
    mutationFn: ({ wasWishlisted, watchId }) => (
      wasWishlisted ? commerceApi.removeWishlistItem(watchId) : commerceApi.addWishlistItem(watchId)
    ),
    onSuccess: refreshWishlist,
  })

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
      await addCartMutation.mutateAsync({ watchId, quantity: requestedQuantity })
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
      await updateCartMutation.mutateAsync({ watchId, quantity: nextQuantity })
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
      await removeCartMutation.mutateAsync(watchId)
      setError('')
    } catch (apiError) {
      handleActionError(apiError, 'Unable to remove this item.')
    } finally {
      setPending(watchId, false)
    }
  }

  const clearCart = async () => {
    try {
      await clearCartMutation.mutateAsync()
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
      await wishlistMutation.mutateAsync({ wasWishlisted, watchId })
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
    error: error || (cartQuery.error || wishlistQuery.error
      ? getApiErrorMessage(cartQuery.error || wishlistQuery.error, 'Unable to load cart and wishlist.')
      : ''),
    isLoading: cartQuery.isLoading || wishlistQuery.isLoading,
    isRestoring,
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
