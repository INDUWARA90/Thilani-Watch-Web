import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Heart, ShoppingBag, Star } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { useCommerce } from '../../commerce/useCommerce'
import { formatMoney, getId, getTitle, getWatchImage } from '../storefrontUtils'

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

  const handleAddToCart = async () => {
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

  const handleWishlist = async () => {
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
      className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-[#D4AF37]/70 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)]"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative overflow-hidden bg-slate-100">
        <Link className="block no-underline" to={detailPath}>
        <img
          alt={watch.name || 'Watch'}
          className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          src={image || imageFallback}
        />
        </Link>
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-950 shadow-sm backdrop-blur">
          {isAvailable ? 'In stock' : 'Sold out'}
        </div>
        <button
          className="absolute right-3 top-3 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-950 shadow-sm backdrop-blur transition hover:border-[#D4AF37] hover:text-[#8f6f10] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isBusy}
          type="button"
          aria-label={isWishlisted(watchId) ? 'Remove from wishlist' : 'Save to wishlist'}
          onClick={handleWishlist}
        >
          <Heart className={`h-5 w-5 ${isWishlisted(watchId) ? 'fill-[#D4AF37] text-[#8f6f10]' : ''}`} />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#8f6f10]">
          <span>{getTitle(watch.brand, 'Brand')}</span>
          <span className="text-slate-300">/</span>
          <span>{getTitle(watch.category, 'Category')}</span>
        </div>
        <h3 className="mb-2 text-lg font-black leading-snug text-slate-950">
          <Link className="text-slate-950 no-underline hover:text-[#8f6f10]" to={detailPath}>
            {watch.name || 'Untitled watch'}
          </Link>
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-slate-600">{watch.shortDescription || watch.description || 'A refined watch ready for your collection.'}</p>
        <div className="flex items-center justify-between gap-3">
          <strong className="text-lg text-slate-950">{formatMoney(watch.price, watch.currency)}</strong>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#D4AF37]/15 px-2.5 py-1 text-xs font-extrabold text-[#8f6f10]">
            <Star className="h-3.5 w-3.5 fill-[#D4AF37]" /> {watch.ratingAverage ? Number(watch.ratingAverage).toFixed(1) : 'New'}
          </span>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-extrabold text-white transition hover:bg-[#D4AF37] hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60" disabled={!isAvailable || isBusy} type="button" onClick={handleAddToCart}>
            <ShoppingBag className="h-4 w-4" /> {isBusy ? 'Working...' : 'Add'}
          </button>
          <Link className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-950 no-underline transition hover:border-[#D4AF37] hover:text-[#8f6f10]" to={detailPath}>
            <Eye className="h-4 w-4" /> Quick view
          </Link>
        </div>
        {(message || error) && <p className={`mt-3 text-sm font-bold ${error ? 'text-red-700' : 'text-emerald-700'}`}>{error || message}</p>}
      </div>
    </motion.article>
  )
}
