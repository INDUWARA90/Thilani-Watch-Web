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
      <div className="mx-auto mt-12 max-w-xl border border-[#DC3545] bg-red-50 p-4 text-center font-normal text-[#DC3545]">
        {error || 'Watch not found.'}{' '}
        <Link className="text-red-900 underline ml-1 hover:text-red-950" to="/watches">
          Back to watches
        </Link>
      </div>
    )
  }

  const images = normalizeImages(watch)
  const stockQuantity = Number(watch.stockQuantity || 0)
  const isAvailable = watch.inStock || stockQuantity > 0

  return (
    <main className="mx-auto max-w-7xl min-w-0 overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Navigation Button */}
      <Link 
        className="group mb-8 inline-flex min-h-11 max-w-full items-center gap-2 rounded-[14px] border border-[#DEE2E6] bg-[rgba(18,18,18,0.04)] px-5 text-sm font-normal text-[#121212] no-underline transition hover:bg-[rgba(18,18,18,0.08)] sm:px-8" 
        to="/watches"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to collection
      </Link>

      <section className="grid min-w-0 gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
        {/* Media Column Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="min-w-0 flex flex-col gap-4"
        >
          <div className="overflow-hidden rounded-[20px] border border-[#DEE2E6] bg-[#F8F9FA] shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)]">
            <img 
              className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-102" 
              src={detail.selectedImage || '/favicon.svg'} 
              alt={watch.name} 
            />
          </div>
          {images.length > 1 && (
            <div className="flex flex-wrap gap-2.5">
              {images.map((image) => (
                <button 
                  className={`relative h-16 w-16 cursor-pointer overflow-hidden rounded-[14px] border bg-white p-0 transition-all duration-200 ${
                    detail.selectedImage === image 
                      ? 'scale-95 border-[#F49006] ring-2 ring-[#F49006]/20' 
                      : 'border-[#DEE2E6] hover:border-[#A7A7A7]'
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

        {/* Product Meta Content Info Column */}
        <div className="min-w-0 flex flex-col">
          <span className="mb-2 text-sm font-normal text-[#F49006]">
            {getTitle(watch.brand, 'Brand')} &middot; {getTitle(watch.category, 'Category')}
          </span>
          
          <h1 className="mb-4 break-words text-4xl font-extrabold leading-tight text-[#121212] sm:text-[44px]">
            {watch.name}
          </h1>

          <div className="mb-6 flex flex-wrap items-center gap-4">
            <span className="text-2xl font-bold text-[#121212]">
              {formatMoney(watch.price, watch.currency)}
            </span>
            <div className="h-4 w-px bg-[#DEE2E6]" />
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              watch.inStock || watch.stockQuantity > 0 ? 'border border-[#198754] bg-green-50 text-[#198754]' : 'border border-[#DEE2E6] bg-[#F8F9FA] text-[#6C757D]'
            }`}>
              {watch.inStock || watch.stockQuantity > 0 ? `${watch.stockQuantity ?? 'Available'} Available` : 'Out of Stock'}
            </span>
            {watch.ratingAverage && (
              <span className="inline-flex items-center gap-1 text-sm font-normal text-[#121212]">
                <Star className="h-4 w-4 fill-[#F49006] text-[#F49006]" /> 
                {Number(watch.ratingAverage).toFixed(1)} Rating
              </span>
            )}
          </div>

          <p className="mb-8 text-base leading-7 text-[#212529]">
            {watch.shortDescription || watch.description || 'A refined modern classic designed to elevate any collection.'}
          </p>

          {/* Actions Workspace Panel */}
          <div className="mb-8 rounded-[20px] border border-[#DEE2E6] bg-[#F8F9FA] p-5">
            {/* Action Messaging */}
            {(detail.actionMessage || detail.actionError) && (
              <div className={`mb-4 border p-3 text-sm font-normal ${
                detail.actionError ? 'border-[#DC3545] bg-red-50 text-[#DC3545]' : 'border-[#198754] bg-green-50 text-[#198754]'
              }`}>
                {detail.actionError || detail.actionMessage}
              </div>
            )}
            
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex flex-col gap-1.5 text-base font-normal text-[#121212] sm:w-28">
                Qty
                <input
                  className="h-11 min-w-0 border border-[#DEE2E6] bg-white text-center font-normal text-[#121212] outline-none transition focus:border-[#0D6EFD] focus:ring-2 focus:ring-[#0D6EFD]/25"
                  max={stockQuantity || undefined}
                  min="1"
                  type="number"
                  value={detail.quantity}
                  onChange={(event) => detail.setQuantity(Math.max(1, Number(event.target.value || 1)))}
                />
              </label>

              <button 
                className="inline-flex h-11 min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#121212] px-5 text-sm font-normal text-white transition hover:bg-[#272222] disabled:opacity-40 sm:px-8" 
                disabled={!isAvailable || detail.isBusy} 
                type="button" 
                onClick={detail.handleAddToCart}
              >
                {detail.isBusy ? <ButtonSpinner /> : <ShoppingBag className="h-4 w-4" />} 
                {detail.isBusy ? 'Adding to Cart...' : 'Add to Cart'}
              </button>

              <button 
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-[14px] border border-[#DEE2E6] bg-white text-[#121212] transition hover:bg-[rgba(244,144,6,0.1)] hover:text-[#F49006] disabled:opacity-40" 
                disabled={detail.isBusy} 
                type="button" 
                onClick={detail.handleWishlist}
              >
                <Heart className={`h-4 w-4 transition-all ${detail.isWishlisted(detail.watchId) ? 'scale-105 fill-[#F49006] text-[#F49006]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Specifications Definition Details List */}
          <div className="border-t border-[#DEE2E6] pt-6">
            <h2 className="mb-4 text-xl font-bold text-[#121212]">Specifications</h2>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {detailFields.map(([label, key]) => (
                watch[key] ? (
                  <div className="flex justify-between border-b border-[#DEE2E6] py-2 sm:flex-col sm:gap-0.5 sm:border-none" key={key}>
                    <dt className="text-sm font-normal text-[#6C757D]">{label}</dt>
                    <dd className="text-sm font-bold text-[#121212]">{watch[key]}</dd>
                  </div>
                ) : null
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Review Integration Section */}
      <div className="mt-16 border-t border-[#DEE2E6] pt-12">
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
