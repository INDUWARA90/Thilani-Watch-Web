import { Heart, Sparkles, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { LoadingState } from '@/shared/ui/LoadingState'
import { WatchCard } from '@/features/storefront/components/WatchCard'
import { getWishlistWatch, getWishlistWatchId } from '@/features/commerce/lib/commerceUtils'
import { useCommerce } from '@/features/commerce/hooks/useCommerce'
import { usePageTitle } from '@/shared/hooks/usePageTitle'

export const WishlistPage = () => {
  usePageTitle('Wishlist | Thilani Watch Web')

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
    <main className="min-h-screen bg-base pb-24 text-black">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-100/80 via-base to-base px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-10 border-b border-black/5">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[700px] rounded-full bg-gradient-to-tr from-amber-200/20 via-orange-100/10 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-[1200px] min-w-0 flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl min-w-0">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/85 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              Saved Collection
            </div>
            <h1 className="break-words font-heading text-[42px] font-extrabold tracking-tight leading-[1.05] text-black sm:text-[60px] lg:text-[76px]">
              Your Wishlist
            </h1>
            <p className="mt-4 text-base font-normal leading-relaxed text-stone-600 sm:text-lg">
              Keep track of your favorite luxury timepieces and curated picks. Monitor availability or effortlessly transition them to your cart.
            </p>
          </div>

          <Link
            className="group inline-flex min-h-12 w-full max-w-full shrink-0 items-center justify-center gap-2.5 rounded-full bg-black px-7 text-sm font-bold text-white no-underline shadow-lg shadow-black/10 transition-all duration-300 hover:bg-stone-800 hover:shadow-xl active:scale-98 sm:mb-2 sm:w-fit"
            to="/watches"
          >
            Browse watches
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-[1200px] px-4 pt-10 sm:px-6 lg:px-10">
        {(error || actionError) && (
          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 font-medium text-red-700 shadow-sm backdrop-blur-sm">
            {actionError || error}
          </div>
        )}

        {isLoading ? (
          <div className="py-12">
            <LoadingState label="Loading saved watches" variant="cards" rows={3} />
          </div>
        ) : wishlist.length === 0 ? (
          <section className="mx-auto my-12 max-w-xl rounded-3xl border border-dashed border-black/15 bg-white/60 p-8 text-center shadow-xl shadow-black/[0.02] backdrop-blur-md sm:p-14">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-black/5 shadow-inner">
              <Heart className="h-9 w-9 text-stone-700" />
            </div>
            <h2 className="mb-3 font-heading text-2xl font-bold tracking-tight text-black">No saved watches yet</h2>
            <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-stone-600">
              Save your favorite timepieces from listing or detail pages to review, compare, and purchase them here anytime.
            </p>
            <button
              className="inline-flex min-h-12 w-fit cursor-pointer items-center justify-center rounded-full bg-black px-8 text-sm font-bold text-white transition-all duration-300 hover:bg-stone-800 hover:shadow-lg active:scale-98"
              type="button"
              onClick={() => navigate('/watches')}
            >
              Explore Collection
            </button>
          </section>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item) => (
              <div
                className="group flex flex-col justify-between rounded-3xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-black/25 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
                key={getWishlistWatchId(item)}
              >
                <div className="flex-1">
                  <WatchCard watch={getWishlistWatch(item)} />
                </div>
                <button
                  className="mt-5 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 px-4 text-xs font-bold text-red-600 transition-all duration-200 hover:bg-red-500 hover:text-white active:scale-98"
                  type="button"
                  onClick={() => removeItem(item)}
                >
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
