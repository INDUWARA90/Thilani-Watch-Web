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
    const rotateY = ((x / rect.width) - 0.5) * 10
    const rotateX = ((0.5 - y / rect.height) * 10)
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
    e.preventDefault()
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
      className="group relative flex min-w-0 flex-col border border-black/10 bg-white p-4 transition-all duration-300 hover:border-[#F5C518] hover:shadow-xl"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Image Stage Container */}
      <div
        className="relative aspect-[1/1.05] overflow-hidden bg-[#FAF9F5] border border-black/5"
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <Link className="absolute inset-0 block h-full w-full" to={detailPath} aria-label={`View ${watch.name || 'watch'} details`}>
          <img
            alt={watch.name || 'Watch'}
            className="h-full w-full object-cover transition duration-500 ease-out will-change-transform group-hover:scale-105"
            loading="lazy"
            ref={tiltRef}
            src={image || imageFallback}
          />
        </Link>

        {/* Stock Badge */}
        <div className="absolute left-3 top-3 pointer-events-none z-10">
          <span className={`px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-widest ${
            isAvailable 
              ? 'bg-black text-white' 
              : 'bg-red-950 text-red-200'
          }`}>
            {isAvailable ? 'In Stock' : 'Sold Out'}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 cursor-pointer items-center justify-center border border-black/10 bg-white/90 text-black shadow-sm backdrop-blur transition-all duration-200 hover:border-[#F5C518] hover:bg-[#F5C518] hover:text-black focus:outline-none"
          disabled={isBusy}
          type="button"
          aria-label={isWishlisted(watchId) ? 'Remove from wishlist' : 'Save to wishlist'}
          onClick={handleWishlist}
        >
          <Heart className={`h-3.5 w-3.5 ${isWishlisted(watchId) ? 'fill-[#F5C518] text-[#F5C518]' : 'text-current'}`} />
        </button>

        {/* Desktop Quick Actions Overlay */}
        <div className="pointer-events-none absolute inset-0 hidden items-end justify-center bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
          <div className="pointer-events-auto flex w-full gap-2 transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
            <button 
              className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 border border-[#F5C518] bg-[#F5C518] font-sans text-xs font-semibold uppercase tracking-wider text-black transition duration-200 hover:bg-black hover:text-white hover:border-black disabled:opacity-50 focus:outline-none" 
              disabled={!isAvailable || isBusy} 
              type="button" 
              onClick={handleAddToCart}
            >
              {isBusy ? <ButtonSpinner /> : <ShoppingBag className="h-3.5 w-3.5" />} 
              {isBusy ? 'Adding...' : 'Add to Cart'}
            </button>
            <Link 
              className="inline-flex h-10 w-10 items-center justify-center border border-white/30 bg-white/10 text-white backdrop-blur transition duration-200 hover:bg-white hover:text-black focus:outline-none" 
              to={detailPath}
              title="Quick view"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="flex flex-1 flex-col pt-4">
        <div className="mb-1.5 flex items-center justify-between gap-2 font-mono text-[10px] font-medium uppercase tracking-widest text-neutral-500">
          <span className="truncate">{getTitle(watch.brand, 'Brand')}</span>
          <span className="inline-flex shrink-0 items-center gap-1 text-black font-sans font-semibold">
            <Star className="h-3 w-3 fill-[#F5C518] text-[#F5C518]" /> 
            {watch.ratingAverage ? Number(watch.ratingAverage).toFixed(1) : 'New'}
          </span>
        </div>

        <h3 className="mb-1 font-serif text-lg font-normal text-black leading-snug">
          <Link className="text-black no-underline transition duration-200 hover:text-[#F5C518] focus:outline-none" to={detailPath}>
            {watch.name || 'Untitled timepiece'}
          </Link>
        </h3>
        
        <p className="mb-4 line-clamp-1 font-sans text-xs text-neutral-500 leading-relaxed">
          {watch.shortDescription || watch.description || 'A refined minimalist timepiece.'}
        </p>

        <div className="mt-auto border-t border-black/10 pt-3">
          <span className="font-mono text-sm font-semibold tracking-wider text-black">
            {formatMoney(watch.price, watch.currency)}
          </span>
        </div>

        {/* Mobile Quick Actions */}
        <div className="mt-3 grid grid-cols-2 gap-2 md:hidden">
          <button 
            className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 border border-black bg-black font-sans text-[11px] font-semibold uppercase tracking-wider text-white transition duration-200 hover:bg-[#F5C518] hover:text-black hover:border-[#F5C518] disabled:opacity-50" 
            disabled={!isAvailable || isBusy} 
            type="button" 
            onClick={handleAddToCart}
          >
            {isBusy ? <ButtonSpinner /> : <ShoppingBag className="h-3 w-3" />} Add
          </button>
          <Link 
            className="inline-flex h-9 items-center justify-center gap-1.5 border border-black/20 bg-white font-sans text-[11px] font-semibold uppercase tracking-wider text-black no-underline transition duration-200 hover:border-black" 
            to={detailPath}
          >
            <Eye className="h-3 w-3" /> View
          </Link>
        </div>

        {(message || error) && (
          <p className={`mt-2 text-center font-mono text-[10px] uppercase tracking-wider ${error ? 'text-red-600' : 'text-emerald-700'}`}>
            {error || message}
          </p>
        )}
      </div>
    </motion.article>
  )
}