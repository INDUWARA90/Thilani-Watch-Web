import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Heart, ShoppingBag, Star } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { ButtonSpinner } from '@/shared/ui/LoadingState'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useCommerce } from '@/features/commerce/hooks/useCommerce'
import { formatMoney, getId, getTitle, getWatchImage } from '../lib/storefrontUtils'

const imageFallback = '/favicon.svg'

export const WatchCard = ({ watch }) => {
  const { isAuthenticated } = useAuth()
  const { addToCart, isPending, isWishlisted, toggleWishlist } = useCommerce()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const image = getWatchImage(watch)
  const watchId = getId(watch)
  const detailPath = `/watches/${watch.slug || getId(watch)}`
  const isAvailable = watch.inStock || watch.stockQuantity > 0
  const isBusy = isPending(watchId)

  const requireLogin = () => {
    navigate('/login', { state: { from: { pathname: detailPath } } })
  }

  const handleAddToCart = async (e) => {
    e.preventDefault() // Prevents link triggering if nested awkwardly
    if (!isAuthenticated) {
      requireLogin()
      return
    }

    setError('')
    setMessage('')
    try {
      await addToCart(watch, 1)
      setMessage('Added to cart.')
    } catch (actionError) {
      setError(actionError.message)
    }
  }

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      requireLogin()
      return
    }

    setError('')
    setMessage('')
    try {
      await toggleWishlist(watch)
      setMessage(isWishlisted(watchId) ? 'Removed from wishlist.' : 'Saved to wishlist.')
    } catch (actionError) {
      setError(actionError.message)
    }
  }

  return (
    <motion.article
      className="group relative flex flex-col overflow-hidden rounded-[20px] border border-[#DEE2E6] bg-white p-3 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)] transition hover:shadow-[16px_18px_16px_0_rgba(0,0,0,0.1)]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Image Container */}
      <div className="relative aspect-[1/1] overflow-hidden rounded-[20px] bg-[#F8F9FA]">
        <Link className="absolute inset-0 block h-full w-full" to={detailPath} aria-label={`View ${watch.name || 'watch'} details`}>
          <img
            alt={watch.name || 'Watch'}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            src={image || imageFallback}
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 pointer-events-none">
          <span className={`rounded-full border px-3 py-1 text-xs font-normal backdrop-blur ${
            isAvailable 
              ? 'border-[#198754] bg-green-50 text-[#198754]' 
              : 'border-[#DC3545] bg-red-50 text-[#DC3545]'
          }`}>
            {isAvailable ? 'In stock' : 'Sold out'}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-[#121212] transition hover:bg-[rgba(244,144,6,0.1)] hover:text-[#F49006] active:scale-95 disabled:opacity-50"
          disabled={isBusy}
          type="button"
          aria-label={isWishlisted(watchId) ? 'Remove from wishlist' : 'Save to wishlist'}
          onClick={handleWishlist}
        >
          <Heart className={`h-4 w-4 transition-colors ${isWishlisted(watchId) ? 'fill-[#F49006] text-[#F49006]' : 'text-[#121212]'}`} />
        </button>

        {/* Desktop Quick-Action Hover Overlay */}
        <div className="pointer-events-none absolute inset-0 hidden items-end justify-center bg-gradient-to-t from-slate-950/40 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
          <div className="pointer-events-auto flex w-full gap-2 transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
            <button 
              className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#121212] text-sm font-normal text-white transition hover:bg-[#272222] disabled:opacity-50" 
              disabled={!isAvailable || isBusy} 
              type="button" 
              onClick={handleAddToCart}
            >
              {isBusy ? <ButtonSpinner /> : <ShoppingBag className="h-3.5 w-3.5" />} 
              {isBusy ? 'Adding...' : 'Add to Cart'}
            </button>
            <Link 
              className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-white bg-white/20 text-white backdrop-blur transition hover:bg-white hover:text-[#121212]" 
              to={detailPath}
              title="Quick view"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col p-2 pt-4">
        <div className="mb-1 flex items-center justify-between text-sm font-normal text-[#6C757D]">
          <span>{getTitle(watch.brand, 'Brand')}</span>
          <span className="inline-flex items-center gap-1 text-[#F49006]">
            <Star className="h-3 w-3 fill-[#F49006] text-[#F49006]" /> 
            {watch.ratingAverage ? Number(watch.ratingAverage).toFixed(1) : 'New'}
          </span>
        </div>

        <h3 className="mb-1 text-xl font-bold leading-snug text-[#121212]">
          <Link className="text-[#121212] no-underline transition-colors hover:text-[#F49006]" to={detailPath}>
            {watch.name || 'Untitled watch'}
          </Link>
        </h3>
        
        <p className="mb-3 line-clamp-1 text-sm text-[#6C757D]">
          {watch.shortDescription || watch.description || 'A refined minimalist timepiece.'}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-[#DEE2E6] pt-3">
          <span className="text-xl font-bold text-[#121212]">
            {formatMoney(watch.price, watch.currency)}
          </span>
        </div>

        {/* Mobile-Only Action Row */}
        <div className="mt-3 grid gap-2 grid-cols-2 md:hidden">
          <button 
            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#121212] text-sm font-normal text-white transition hover:bg-[#272222] disabled:opacity-50" 
            disabled={!isAvailable || isBusy} 
            type="button" 
            onClick={handleAddToCart}
          >
            {isBusy ? <ButtonSpinner /> : <ShoppingBag className="h-3.5 w-3.5" />} Add
          </button>
          <Link 
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] border border-[#DEE2E6] bg-[rgba(18,18,18,0.04)] text-sm font-normal text-[#121212] no-underline" 
            to={detailPath}
          >
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
        </div>

        {/* Dynamic Status Feedback */}
        {(message || error) && (
          <p className={`mt-2 text-center text-[11px] font-medium ${error ? 'text-red-500' : 'text-emerald-600'}`}>
            {error || message}
          </p>
        )}
      </div>
    </motion.article>
  )
}
