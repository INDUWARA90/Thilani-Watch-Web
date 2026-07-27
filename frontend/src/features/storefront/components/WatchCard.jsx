import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Heart, ShoppingBag, Star } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { ButtonSpinner } from '@/shared/ui/LoadingState'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useCommerce } from '@/features/commerce/hooks/useCommerce'
import { formatMoney, getId, getTitle, getWatchImage } from '../lib/storefrontUtils'

const imageFallback = '/favicon.svg'

const useTiltTransform = () => {
  const ref = useRef(null)

  const handleMouseMove = (event) => {
    const node = ref.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const rotateY = ((x / rect.width) - 0.5) * 14
    const rotateX = ((0.5 - y / rect.height) * 14)
    node.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
    }
  }

  return { handleMouseLeave, handleMouseMove, ref }
}

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
  const { handleMouseLeave, handleMouseMove, ref: tiltRef } = useTiltTransform()

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
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-lg border border-white/12 bg-surface p-3 shadow-[0_18px_50px_rgba(0,0,0,0.28)] transition hover:border-white/35 hover:shadow-glow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div
        className="relative aspect-[1/1] overflow-hidden rounded-md bg-[#111]"
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div className="absolute inset-x-8 bottom-6 h-10 rounded-full bg-white/25 blur-2xl transition group-hover:bg-white/35" />
        <Link className="absolute inset-0 block h-full w-full" to={detailPath} aria-label={`View ${watch.name || 'watch'} details`}>
          <img
            alt={watch.name || 'Watch'}
            className="h-full w-full object-cover transition-transform duration-200 ease-out will-change-transform"
            loading="lazy"
            ref={tiltRef}
            src={image || imageFallback}
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5 pointer-events-none">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur ${
            isAvailable 
              ? 'border-white/25 bg-black/35 text-white' 
              : 'border-red-400/40 bg-red-500/15 text-red-100'
          }`}>
            {isAvailable ? 'In stock' : 'Sold out'}
          </span>
        </div>

        <button
          className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur transition hover:border-white/45 hover:bg-white hover:text-black hover:shadow-glowSm active:scale-95 disabled:opacity-50"
          disabled={isBusy}
          type="button"
          aria-label={isWishlisted(watchId) ? 'Remove from wishlist' : 'Save to wishlist'}
          onClick={handleWishlist}
        >
          <Heart className={`h-4 w-4 transition-colors ${isWishlisted(watchId) ? 'fill-white text-white' : 'text-current'}`} />
        </button>

        <div className="pointer-events-none absolute inset-0 hidden items-end justify-center bg-gradient-to-t from-black/80 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
          <div className="pointer-events-auto flex w-full gap-2 transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
            <button 
              className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-white text-sm font-bold text-black transition hover:shadow-glow disabled:opacity-50" 
              disabled={!isAvailable || isBusy} 
              type="button" 
              onClick={handleAddToCart}
            >
              {isBusy ? <ButtonSpinner /> : <ShoppingBag className="h-3.5 w-3.5" />} 
              {isBusy ? 'Adding...' : 'Add to Cart'}
            </button>
            <Link 
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-black" 
              to={detailPath}
              title="Quick view"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-2 pt-4">
        <div className="mb-1 flex min-w-0 items-center justify-between gap-3 text-sm font-medium text-white/65">
          <span className="min-w-0 truncate">{getTitle(watch.brand, 'Brand')}</span>
          <span className="inline-flex shrink-0 items-center gap-1 text-white/65">
            <Star className="h-3 w-3 fill-white text-white" /> 
            {watch.ratingAverage ? Number(watch.ratingAverage).toFixed(1) : 'New'}
          </span>
        </div>

        <h3 className="mb-1 font-heading text-xl font-bold leading-snug text-white">
          <Link className="text-white no-underline transition hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.45)]" to={detailPath}>
            {watch.name || 'Untitled watch'}
          </Link>
        </h3>
        
        <p className="mb-3 line-clamp-1 text-sm text-white/65">
          {watch.shortDescription || watch.description || 'A refined minimalist timepiece.'}
        </p>

        <div className="mt-auto flex min-w-0 items-center justify-between border-t border-white/10 pt-3">
          <span className="min-w-0 break-words font-heading text-xl font-bold text-white">
            {formatMoney(watch.price, watch.currency)}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 md:hidden">
          <button 
            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-white text-sm font-bold text-black transition hover:shadow-glowSm disabled:opacity-50" 
            disabled={!isAvailable || isBusy} 
            type="button" 
            onClick={handleAddToCart}
          >
            {isBusy ? <ButtonSpinner /> : <ShoppingBag className="h-3.5 w-3.5" />} Add
          </button>
          <Link 
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 text-sm font-bold text-white no-underline" 
            to={detailPath}
          >
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
        </div>

        {(message || error) && (
          <p className={`mt-2 text-center text-[11px] font-medium ${error ? 'text-red-300' : 'text-emerald-300'}`}>
            {error || message}
          </p>
        )}
      </div>
    </motion.article>
  )
}
