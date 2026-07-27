import { Heart } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { LoadingState } from '@/shared/ui/LoadingState'
import { WatchCard } from '@/features/storefront/components/WatchCard'
import { getWishlistWatch, getWishlistWatchId } from '@/features/commerce/lib/commerceUtils'
import { useCommerce } from '@/features/commerce/hooks/useCommerce'

export const WishlistPage = () => {
  const { error, isLoading, toggleWishlist, wishlist } = useCommerce()
  const navigate = useNavigate()
  const [actionError, setActionError] = useState('')

  const removeItem = async (item) => {
    setActionError('')
    try {
      await toggleWishlist(getWishlistWatch(item))
    } catch (removeError) {
      setActionError(removeError.message)
    }
  }

  return (
    <main className="min-h-screen bg-base pb-16 text-white">
      <section className="relative overflow-hidden bg-base px-4 pb-28 pt-20 text-white sm:px-6 sm:pt-24 lg:px-10">
        <div className="relative z-10 mx-auto flex max-w-[1200px] min-w-0 flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl min-w-0">
            <p className="mb-4 inline-flex min-h-9 items-center rounded-full border border-white/15 bg-white/5 px-4 text-xs font-semibold uppercase text-white/75 backdrop-blur-sm">
              Saved watches
            </p>
            <h1 className="break-words font-heading text-[40px] font-bold leading-[1.05] text-white sm:text-[56px] lg:text-[72px]">
              Wishlist
            </h1>
            <p className="mt-4 text-sm font-normal leading-relaxed text-white/75 sm:text-base">
              Keep track of your favorite luxury items and curated picks. Monitor their status or add them to your cart.
            </p>
          </div>
          <Link className="inline-flex min-h-11 w-full max-w-full shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-bold text-white no-underline shadow-sm transition hover:border-white/45 hover:shadow-glowSm active:scale-98 sm:mb-2 sm:w-fit sm:px-8" to="/watches">
            Browse watches
          </Link>
        </div>
        <div className="pointer-events-none absolute bottom-8 left-1/2 h-24 w-[min(980px,92vw)] -translate-x-1/2" aria-hidden="true">
          <div className="glow-beam absolute left-0 top-1/2 h-px w-full bg-white/70 shadow-glow" />
          <div className="glow-beam absolute left-1/2 top-4 h-28 w-[80%] -translate-x-1/2 rounded-[50%] border-t border-white/45" />
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-10">
        {(error || actionError) && <div className="mb-6 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3.5 font-medium text-red-200 shadow-sm">{actionError || error}</div>}

        {isLoading ? (
          <LoadingState label="Loading saved watches" variant="cards" rows={3} />
        ) : wishlist.length === 0 ? (
          <section className="mx-auto my-8 max-w-2xl rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-6 text-center shadow-sm sm:p-12">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-2 font-heading text-2xl font-bold text-white">No saved watches yet</h2>
            <p className="mx-auto mb-6 max-w-sm text-white/65">Save favorite timepieces from listing or detail pages to review them here anytime.</p>
            <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center rounded-full bg-white px-8 text-sm font-bold text-black transition hover:shadow-glow active:scale-98" type="button" onClick={() => navigate('/watches')}>
              Browse watches
            </button>
          </section>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item) => (
              <div className="flex flex-col rounded-lg border border-white/12 bg-surface p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition duration-200 hover:border-white/30 hover:shadow-glowSm" key={getWishlistWatchId(item)}>
                <div className="flex-1">
                  <WatchCard watch={getWishlistWatch(item)} />
                </div>
                <button className="mt-4 inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-red-400/25 bg-red-500/10 px-4 text-xs font-bold text-red-200 transition hover:bg-red-500/20 active:scale-98" type="button" onClick={() => removeItem(item)}>
                  Remove from wishlist
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
