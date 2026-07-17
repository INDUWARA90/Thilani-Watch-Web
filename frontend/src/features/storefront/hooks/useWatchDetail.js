import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useCommerce } from '@/features/commerce/hooks/useCommerce'
import { storefrontApi } from '@/features/storefront/api/storefrontApi'
import { getId, getWatchImage, normalizeWatchPayload } from '@/features/storefront/lib/storefrontUtils'

export const useWatchDetail = (slug) => {
  const { isAuthenticated } = useAuth()
  const { addToCart, isPending, isWishlisted, toggleWishlist } = useCommerce()
  const navigate = useNavigate()
  const [actionError, setActionError] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState('')
  const [watch, setWatch] = useState(null)

  const watchId = getId(watch)
  const isBusy = isPending(watchId)

  useEffect(() => {
    let isMounted = true

    const loadWatch = async () => {
      setIsLoading(true)
      try {
        const nextWatch = await findWatch(slug)
        if (!isMounted) return
        setWatch(nextWatch)
        setSelectedImage(getWatchImage(nextWatch))
        setError('')
      } catch (apiError) {
        if (!isMounted) return
        setError(getApiErrorMessage(apiError, 'Unable to load this watch.'))
        setWatch(null)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadWatch()
    return () => {
      isMounted = false
    }
  }, [slug])

  const requireLogin = () => {
    navigate('/login', { state: { from: { pathname: `/watches/${slug}` } } })
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) return requireLogin()

    setActionError('')
    setActionMessage('')
    try {
      await addToCart(watch, quantity)
      setActionMessage('Added to cart.')
    } catch (addError) {
      setActionError(addError.message)
    }
  }

  const handleWishlist = async () => {
    if (!isAuthenticated) return requireLogin()

    const wasWishlisted = isWishlisted(watchId)
    setActionError('')
    setActionMessage('')
    try {
      await toggleWishlist(watch)
      setActionMessage(wasWishlisted ? 'Removed from wishlist.' : 'Saved to wishlist.')
    } catch (wishlistError) {
      setActionError(wishlistError.message)
    }
  }

  const refreshWatchSummary = async () => {
    setWatch(await findWatch(slug))
  }

  return {
    actionError,
    actionMessage,
    error,
    handleAddToCart,
    handleWishlist,
    isBusy,
    isLoading,
    isWishlisted,
    quantity,
    refreshWatchSummary,
    selectedImage,
    setQuantity,
    setSelectedImage,
    watch,
    watchId,
  }
}

const findWatch = async (slug) => {
  try {
    return normalizeWatchPayload(await storefrontApi.getWatchBySlug(slug))
  } catch {
    return normalizeWatchPayload(await storefrontApi.getWatchById(slug))
  }
}
