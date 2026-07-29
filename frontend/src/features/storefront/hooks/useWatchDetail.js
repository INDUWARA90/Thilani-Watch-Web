import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
  const [quantity, setQuantity] = useState(1)
  const [selectedImageState, setSelectedImageState] = useState({ image: '', slug: '' })
  const {
    data: watch = null,
    error: watchError,
    isLoading,
    refetch,
  } = useQuery({
    enabled: Boolean(slug),
    queryKey: ['storefront', 'watch', slug],
    queryFn: () => findWatch(slug),
  })

  const watchId = getId(watch)
  const isBusy = isPending(watchId)
  const selectedImage = selectedImageState.slug === slug && selectedImageState.image
    ? selectedImageState.image
    : getWatchImage(watch)
  const setSelectedImage = (image) => setSelectedImageState({ image, slug })

  const error = watchError ? getApiErrorMessage(watchError, 'Unable to load this watch.') : ''

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
    await refetch()
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
