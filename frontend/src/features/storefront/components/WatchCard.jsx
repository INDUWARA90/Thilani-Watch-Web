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
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-3 transition-all duration-300 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Image Container */}
      <div className="relative aspect-[1/1] overflow-hidden rounded-xl bg-slate-50">
        <Link className="block h-full w-full" to={detailPath}>
          <img
            alt={watch.name || 'Watch'}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            src={image || imageFallback}
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 pointer-events-none">
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md shadow-sm ${
            isAvailable 
              ? 'bg-white/80 text-slate-900 border border-white/20' 
              : 'bg-red-500/10 text-red-600 border border-red-500/20'
          }`}>
            {isAvailable ? 'In stock' : 'Sold out'}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/70 backdrop-blur-md text-slate-900 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95 disabled:opacity-50"
          disabled={isBusy}
          type="button"
          aria-label={isWishlisted(watchId) ? 'Remove from wishlist' : 'Save to wishlist'}
          onClick={handleWishlist}
        >
          <Heart className={`h-4 w-4 transition-colors ${isWishlisted(watchId) ? 'fill-amber-500 text-amber-500' : 'text-slate-700 group-hover/btn:text-slate-900'}`} />
        </button>

        {/* Desktop Quick-Action Hover Overlay */}
        <div className="absolute inset-0 hidden items-end justify-center bg-gradient-to-t from-slate-950/40 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
          <div className="flex w-full gap-2 transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
            <button 
              className="flex-1 inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-white text-xs font-bold text-slate-950 shadow-md transition hover:bg-amber-500 hover:text-slate-950 disabled:opacity-50" 
              disabled={!isAvailable || isBusy} 
              type="button" 
              onClick={handleAddToCart}
            >
              {isBusy ? <ButtonSpinner /> : <ShoppingBag className="h-3.5 w-3.5" />} 
              {isBusy ? 'Adding...' : 'Add to Cart'}
            </button>
            <Link 
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md text-white border border-white/20 transition hover:bg-white hover:text-slate-950" 
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
        <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <span>{getTitle(watch.brand, 'Brand')}</span>
          <span className="inline-flex items-center gap-0.5 font-semibold text-amber-600">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> 
            {watch.ratingAverage ? Number(watch.ratingAverage).toFixed(1) : 'New'}
          </span>
        </div>

        <h3 className="mb-1 text-base font-semibold tracking-tight text-slate-900 line-clamp-1">
          <Link className="text-slate-900 no-underline transition-colors hover:text-amber-600" to={detailPath}>
            {watch.name || 'Untitled watch'}
          </Link>
        </h3>
        
        <p className="mb-3 line-clamp-1 text-xs text-slate-400">
          {watch.shortDescription || watch.description || 'A refined minimalist timepiece.'}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-3">
          <span className="text-base font-bold text-slate-900">
            {formatMoney(watch.price, watch.currency)}
          </span>
        </div>

        {/* Mobile-Only Action Row */}
        <div className="mt-3 grid gap-2 grid-cols-2 md:hidden">
          <button 
            className="inline-flex min-h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-slate-950 text-xs font-bold text-white transition disabled:opacity-50" 
            disabled={!isAvailable || isBusy} 
            type="button" 
            onClick={handleAddToCart}
          >
            {isBusy ? <ButtonSpinner /> : <ShoppingBag className="h-3.5 w-3.5" />} Add
          </button>
          <Link 
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 no-underline" 
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