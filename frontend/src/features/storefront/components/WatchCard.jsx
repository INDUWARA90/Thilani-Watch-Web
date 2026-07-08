import { useState } from 'react'
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
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_14px_45px_rgba(28,41,56,0.07)]">
      <Link className="block bg-slate-100 no-underline" to={detailPath}>
        <img
          alt={watch.name || 'Watch'}
          className="aspect-[4/3] w-full object-cover"
          loading="lazy"
          src={image || imageFallback}
        />
      </Link>
      <div className="p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase text-teal-700">
          <span>{getTitle(watch.brand, 'Brand')}</span>
          <span className="text-slate-300">/</span>
          <span>{getTitle(watch.category, 'Category')}</span>
        </div>
        <h3 className="mb-2 text-lg font-bold leading-snug text-slate-950">
          <Link className="text-slate-950 no-underline hover:text-teal-700" to={detailPath}>
            {watch.name || 'Untitled watch'}
          </Link>
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-slate-600">{watch.shortDescription || watch.description || 'A refined watch ready for your collection.'}</p>
        <div className="flex items-center justify-between gap-3">
          <strong className="text-lg text-slate-950">{formatMoney(watch.price, watch.currency)}</strong>
          <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${watch.inStock || watch.stockQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
            {watch.inStock || watch.stockQuantity > 0 ? 'In stock' : 'Out of stock'}
          </span>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg bg-teal-700 px-3 font-extrabold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={!isAvailable || isBusy} type="button" onClick={handleAddToCart}>
            {isBusy ? 'Working...' : 'Add to cart'}
          </button>
          <button className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-3 font-extrabold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60" disabled={isBusy} type="button" onClick={handleWishlist}>
            {isWishlisted(watchId) ? 'Saved' : 'Save'}
          </button>
        </div>
        {(message || error) && <p className={`mt-3 text-sm font-bold ${error ? 'text-red-700' : 'text-emerald-700'}`}>{error || message}</p>}
      </div>
    </article>
  )
}
