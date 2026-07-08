import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { getApiErrorMessage } from '../../lib/apiClient'
import { usePageTitle } from '../../lib/usePageTitle'
import { useAuth } from '../auth/useAuth'
import { useCommerce } from '../commerce/useCommerce'
import { ReviewSection } from '../reviews/ReviewSection'
import { storefrontApi } from './storefrontApi'
import { formatMoney, getId, getTitle, getWatchImage, normalizeWatchPayload } from './storefrontUtils'

const detailFields = [
  ['Collection', 'collection'],
  ['Movement', 'movementType'],
  ['Case material', 'caseMaterial'],
  ['Strap material', 'strapMaterial'],
  ['Water resistance', 'waterResistance'],
  ['Color', 'color'],
  ['Dial color', 'dialColor'],
  ['Size', 'size'],
  ['SKU', 'sku'],
]

export const WatchDetailPage = () => {
  const { slug } = useParams()
  const { isAuthenticated } = useAuth()
  const { addToCart, isPending, isWishlisted, toggleWishlist } = useCommerce()
  const navigate = useNavigate()
  const [watch, setWatch] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [actionError, setActionError] = useState('')

  usePageTitle(watch?.name ? `${watch.name} | Thilani Watch Web` : 'Watch Details | Thilani Watch Web')

  useEffect(() => {
    let isMounted = true

    const loadWatch = async () => {
      setIsLoading(true)
      try {
        const payload = await storefrontApi.getWatchBySlug(slug)
        const nextWatch = normalizeWatchPayload(payload)
        if (isMounted) {
          setWatch(nextWatch)
          setSelectedImage(getWatchImage(nextWatch))
          setError('')
        }
      } catch (apiError) {
        try {
          const fallbackPayload = await storefrontApi.getWatchById(slug)
          const nextWatch = normalizeWatchPayload(fallbackPayload)
          if (isMounted) {
            setWatch(nextWatch)
            setSelectedImage(getWatchImage(nextWatch))
            setError('')
          }
        } catch {
          if (isMounted) {
            setError(getApiErrorMessage(apiError, 'Unable to load this watch.'))
            setWatch(null)
          }
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadWatch()

    return () => {
      isMounted = false
    }
  }, [slug])

  if (isLoading) {
    return <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 font-bold text-emerald-950">Loading watch...</div>
  }

  if (error || !watch) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">
        {error || 'Watch not found.'} <Link className="text-red-900 underline" to="/watches">Back to watches</Link>
      </div>
    )
  }

  const images = normalizeImages(watch)
  const watchId = getId(watch)
  const stockQuantity = Number(watch.stockQuantity || 0)
  const isAvailable = watch.inStock || stockQuantity > 0
  const isBusy = isPending(watchId)

  const requireLogin = () => {
    navigate('/login', { state: { from: { pathname: `/watches/${slug}` } } })
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      requireLogin()
      return
    }

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
    if (!isAuthenticated) {
      requireLogin()
      return
    }

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
    try {
      const payload = await storefrontApi.getWatchBySlug(slug)
      const nextWatch = normalizeWatchPayload(payload)
      setWatch(nextWatch)
    } catch {
      const fallbackPayload = await storefrontApi.getWatchById(slug)
      const nextWatch = normalizeWatchPayload(fallbackPayload)
      setWatch(nextWatch)
    }
  }

  return (
    <main>
      <Link className="mb-5 inline-block font-bold text-teal-700 no-underline hover:underline" to="/watches">
        Back to watches
      </Link>
      <section className="grid gap-8 rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(28,41,56,0.08)] lg:grid-cols-[minmax(0,1fr)_420px] lg:p-7">
        <div>
          <img className="aspect-[4/3] w-full rounded-lg bg-slate-100 object-cover" src={selectedImage || '/favicon.svg'} alt={watch.name} />
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((image) => (
                <button className="overflow-hidden rounded-lg border border-slate-200 bg-white p-0" key={image} type="button" onClick={() => setSelectedImage(image)}>
                  <img className="aspect-square w-full object-cover" src={image} alt={watch.name} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-extrabold uppercase tracking-normal text-teal-700">
            {getTitle(watch.brand, 'Brand')} / {getTitle(watch.category, 'Category')}
          </p>
          <h1 className="mb-3 text-4xl font-bold leading-tight text-slate-950">{watch.name}</h1>
          <p className="mb-4 text-lg text-slate-600">{watch.shortDescription || watch.description}</p>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <strong className="text-2xl text-slate-950">{formatMoney(watch.price, watch.currency)}</strong>
            <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${watch.inStock || watch.stockQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
              {watch.inStock || watch.stockQuantity > 0 ? `${watch.stockQuantity ?? 'Available'} in stock` : 'Out of stock'}
            </span>
            {watch.ratingAverage ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-extrabold text-amber-800">{Number(watch.ratingAverage).toFixed(1)} rating</span> : null}
          </div>
          {watch.description && <p className="mb-6 leading-7 text-slate-700">{watch.description}</p>}

          <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            {(actionMessage || actionError) && <div className={`mb-4 rounded-lg border px-3.5 py-3 font-bold ${actionError ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-100 bg-emerald-50 text-emerald-950'}`}>{actionError || actionMessage}</div>}
            <div className="grid gap-3 sm:grid-cols-[120px_1fr_1fr]">
              <label className="grid gap-2 text-sm font-extrabold text-slate-700">
                Quantity
                <input
                  className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15"
                  max={stockQuantity || undefined}
                  min="1"
                  type="number"
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value || 1))}
                />
              </label>
              <button className="inline-flex min-h-11 cursor-pointer items-center justify-center self-end rounded-lg bg-teal-700 px-4 font-extrabold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={!isAvailable || isBusy} type="button" onClick={handleAddToCart}>
                {isBusy ? 'Working...' : 'Add to cart'}
              </button>
              <button className="inline-flex min-h-11 cursor-pointer items-center justify-center self-end rounded-lg border border-slate-300 bg-white px-4 font-extrabold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60" disabled={isBusy} type="button" onClick={handleWishlist}>
                {isWishlisted(watchId) ? 'Saved to wishlist' : 'Save to wishlist'}
              </button>
            </div>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            {detailFields.map(([label, key]) => (
              watch[key] ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3" key={key}>
                  <dt className="text-xs font-extrabold uppercase text-slate-500">{label}</dt>
                  <dd className="mt-1 font-bold text-slate-950">{watch[key]}</dd>
                </div>
              ) : null
            ))}
          </dl>
        </div>
      </section>
      <ReviewSection onReviewsChanged={refreshWatchSummary} watchId={watchId} />
    </main>
  )
}

const normalizeImages = (watch) => {
  const images = [watch.thumbnail, ...(watch.images || [])]
    .map((image) => {
      if (typeof image === 'string') return image
      return image?.url || image?.secureUrl || image?.src || ''
    })
    .filter(Boolean)

  return [...new Set(images)]
}
