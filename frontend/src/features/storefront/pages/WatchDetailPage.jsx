import { motion } from 'framer-motion'
import { ArrowLeft, Heart, ShoppingBag, Star } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { ButtonSpinner, LoadingState } from '@/shared/ui/LoadingState'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { ReviewSection } from '@/features/reviews/components/ReviewSection'
import { useWatchDetail } from '@/features/storefront/hooks/useWatchDetail'
import { formatMoney, getTitle } from '@/features/storefront/lib/storefrontUtils'

const detailFields = [
  ['Collection', 'collection'],
  ['Movement', 'movementType'],
  ['Case material', 'caseMaterial'],
  ['Strap material', 'strapMaterial'],
  ['Strap size', 'strapSize'],
  ['Water resistance', 'waterResistance'],
  ['Color', 'color'],
  ['Dial color', 'dialColor'],
  ['Dial size', 'dialSize'],
  ['Size', 'size'],
  ['Gender', 'gender'],
  ['SKU', 'sku'],
]

export const WatchDetailPage = () => {
  const { slug } = useParams()
  const detail = useWatchDetail(slug)
  const { error, isLoading, watch } = detail

  usePageTitle(watch?.name ? `${watch.name} | Thilani Watch Web` : 'Watch Details | Thilani Watch Web')

  if (isLoading) {
    return <LoadingState label="Preparing watch details" variant="detail" />
  }

  if (error || !watch) {
    return (
      <div className="mx-auto mt-16 max-w-xl border border-red-900/30 bg-red-50/50 p-6 text-center font-sans text-sm text-red-700">
        <p className="mb-4">{error || 'Timepiece not found.'}</p>
        <Link className="font-mono text-xs font-semibold uppercase tracking-wider text-black underline hover:text-[#F5C518]" to="/watches">
          Return to watches
        </Link>
      </div>
    )
  }

  const images = normalizeImages(watch)
  const stockQuantity = Number(watch.stockQuantity || 0)
  const isAvailable = watch.inStock || stockQuantity > 0

  return (
    <main className="mx-auto max-w-[1280px] min-w-0 bg-white px-4 py-12 text-black sm:px-6 lg:px-10">
      {/* Back Link */}
      <Link 
        className="group mb-10 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-black no-underline transition hover:text-[#F5C518]" 
        to="/watches"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to collection
      </Link>

      <section className="grid min-w-0 gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
        {/* Gallery Section */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="min-w-0 flex flex-col gap-4"
        >
          <div className="relative aspect-square w-full overflow-hidden border border-black/10 bg-[#FAF9F5]">
            <img 
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" 
              src={detail.selectedImage || '/favicon.svg'} 
              alt={watch.name} 
            />
          </div>

          {images.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {images.map((image) => (
                <button 
                  className={`relative aspect-square h-20 cursor-pointer overflow-hidden border bg-[#FAF9F5] p-0 transition-all duration-200 focus:outline-none ${
                    detail.selectedImage === image 
                      ? 'border-[#F5C518] ring-1 ring-[#F5C518]' 
                      : 'border-black/10 opacity-70 hover:border-black hover:opacity-100'
                  }`} 
                  key={image} 
                  type="button" 
                  onClick={() => detail.setSelectedImage(image)}
                >
                  <img className="h-full w-full object-cover" src={image} alt={watch.name} />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Watch Information & Actions */}
        <div className="min-w-0 flex flex-col">
          {/* Category & Brand Metadata Badge */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="bg-black px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-widest text-white">
              {getTitle(watch.brand, 'Brand')}
            </span>
            <span className="border border-black/10 bg-[#FAF9F5] px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-widest text-neutral-600">
              {getTitle(watch.category, 'Category')}
            </span>
          </div>
          
          <h1 className="mb-4 break-words font-serif text-3xl font-normal leading-tight text-black sm:text-4xl lg:text-5xl">
            {watch.name}
          </h1>

          <div className="mb-6 flex flex-wrap items-center gap-4 border-y border-black/10 py-4">
            <span className="font-mono text-2xl font-semibold tracking-wider text-black">
              {formatMoney(watch.price, watch.currency)}
            </span>

            <div className="h-4 w-px bg-black/10" />

            <span className={`font-mono text-xs font-semibold uppercase tracking-wider ${
              isAvailable ? 'text-black' : 'text-red-600'
            }`}>
              {isAvailable ? `${watch.stockQuantity ?? 'In'} Stock` : 'Out of Stock'}
            </span>

            {watch.ratingAverage && (
              <>
                <div className="h-4 w-px bg-black/10" />
                <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-black">
                  <Star className="h-3.5 w-3.5 fill-[#F5C518] text-[#F5C518]" /> 
                  {Number(watch.ratingAverage).toFixed(1)}
                </span>
              </>
            )}
          </div>

          <p className="mb-8 font-sans text-sm text-neutral-600 leading-relaxed sm:text-black">
            {watch.shortDescription || watch.description || 'A refined timepiece crafted with precise detail and timeless aesthetic.'}
          </p>

          {/* Checkout Controls Container */}
          <div className="mb-10 border border-black/10 bg-[#FAF9F5] p-4 sm:p-6">
            {(detail.actionMessage || detail.actionError) && (
              <div className={`mb-4 border p-3 font-mono text-xs uppercase tracking-wider ${
                detail.actionError ? 'border-red-600/30 bg-red-50 text-red-700' : 'border-emerald-600/30 bg-emerald-50 text-emerald-800'
              }`}>
                {detail.actionError || detail.actionMessage}
              </div>
            )}
            
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex w-full flex-col gap-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-500 sm:w-24">
                Qty
                <input
                  className="h-12 min-w-0 border border-black/15 bg-white text-center font-mono text-base font-semibold text-black outline-none transition focus:border-black focus:ring-1 focus:ring-black sm:h-11 sm:text-sm"
                  max={stockQuantity || undefined}
                  min="1"
                  type="number"
                  value={detail.quantity}
                  onChange={(event) => detail.setQuantity(Math.max(1, Number(event.target.value || 1)))}
                />
              </label>

              <button 
                className="inline-flex h-12 w-full min-w-0 cursor-pointer items-center justify-center gap-2 border border-[#F5C518] bg-[#F5C518] px-6 font-sans text-sm font-semibold uppercase tracking-wider text-black transition duration-200 hover:border-black hover:bg-black hover:text-white disabled:opacity-40 sm:h-11 sm:flex-1 sm:text-xs" 
                disabled={!isAvailable || detail.isBusy} 
                type="button" 
                onClick={detail.handleAddToCart}
              >
                {detail.isBusy ? <ButtonSpinner /> : <ShoppingBag className="h-5 w-5 sm:h-4 sm:w-4" />} 
                {detail.isBusy ? 'Adding to Cart...' : 'Add to Cart'}
              </button>

              <button 
                className="inline-flex h-12 w-full cursor-pointer items-center justify-center border border-black/10 bg-white text-black transition duration-200 hover:border-[#F5C518] hover:bg-[#F5C518] hover:text-black disabled:opacity-40 sm:h-11 sm:w-11" 
                disabled={detail.isBusy} 
                type="button" 
                aria-label="Save to wishlist"
                onClick={detail.handleWishlist}
              >
                <Heart className={`h-4 w-4 transition-all ${detail.isWishlisted(detail.watchId) ? 'fill-[#F5C518] text-[#F5C518]' : 'text-current'}`} />
              </button>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="border-t border-black/10 pt-8">
            <h2 className="mb-6 font-serif text-2xl font-normal text-black">Technical Specifications</h2>
            <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {detailFields.map(([label, key]) => (
                watch[key] ? (
                  <div className="flex min-w-0 flex-col gap-0.5 border-b border-black/5 py-2.5 min-[420px]:flex-row min-[420px]:justify-between sm:flex-col sm:border-b-0" key={key}>
                    <dt className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-500">{label}</dt>
                    <dd className="min-w-0 break-words font-sans text-xs font-semibold text-black min-[420px]:text-right sm:text-left">{watch[key]}</dd>
                  </div>
                ) : null
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <div className="mt-20 border-t border-black/10 pt-16">
        <ReviewSection onReviewsChanged={detail.refreshWatchSummary} watchId={detail.watchId} />
      </div>
    </main>
  )
}

const normalizeImages = (watch) => {
  const images = []
  const rawImages = [watch.thumbnail, ...(watch.images || [])]

  for (const image of rawImages) {
    const imageUrl = readImageUrl(image)
    if (imageUrl && !images.includes(imageUrl)) images.push(imageUrl)
  }

  return images
}

const readImageUrl = (image) => {
  if (typeof image === 'string') return image
  return image?.url || image?.secureUrl || image?.src || ''
}
