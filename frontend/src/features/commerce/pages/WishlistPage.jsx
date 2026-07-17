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
    <main className="-mx-4 -mt-8 bg-white sm:-mx-6 lg:-mx-8 min-h-screen pb-16">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F49006_0%,#EB960E_100%)] px-4 pb-32 pt-16 text-white sm:px-6 sm:pt-20 lg:px-10">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between relative z-10">
          <div className="max-w-xl">
            <p className="mb-3 inline-flex min-h-9 items-center rounded-full border border-white/30 bg-white/10 px-4 text-xs font-medium tracking-wide uppercase text-white backdrop-blur-sm">
              Saved watches
            </p>
            <h1 className="text-[44px] font-black leading-[1.1] text-white sm:text-[56px] lg:text-[65px] lg:leading-[71px] tracking-tight">
              Wishlist
            </h1>
            <p className="mt-3 text-sm font-normal text-white/80 sm:text-base leading-relaxed">
              Keep track of your favorite luxury items and curated picks. Monitor their status or add them to your cart.
            </p>
          </div>
          <Link className="inline-flex min-h-11 w-fit items-center justify-center rounded-[14px] bg-[#121212] px-8 text-sm font-medium text-white no-underline transition shadow-sm hover:bg-[#272222] active:scale-98 shrink-0 sm:mb-2" to="/watches">
            Browse watches
          </Link>
        </div>
        <svg className="absolute bottom-[-1px] left-0 h-20 w-full text-white" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0 70L60 62.7C120 55 240 41 360 49.3C480 58 600 88 720 92.7C840 98 960 77 1080 63.3C1200 50 1320 44 1380 41.3L1440 39V120H0V70Z" />
        </svg>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-10">
        {(error || actionError) && <div className="mb-6 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3.5 font-medium text-red-600 shadow-sm">{actionError || error}</div>}

        {isLoading ? (
          <LoadingState label="Loading saved watches" variant="cards" rows={3} />
        ) : wishlist.length === 0 ? (
          <section className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm max-w-2xl mx-auto my-8">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
              <Heart className="h-8 w-8 text-[#F49006]" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-[#121212]">No saved watches yet</h2>
            <p className="mb-6 text-slate-500 max-w-sm mx-auto">Save favorite timepieces from listing or detail pages to review them here anytime.</p>
            <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center rounded-[14px] bg-[#121212] px-8 text-sm font-medium text-white transition hover:bg-[#272222] active:scale-98" type="button" onClick={() => navigate('/watches')}>
              Browse watches
            </button>
          </section>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item) => (
              <div className="flex flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition duration-200 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]" key={getWishlistWatchId(item)}>
                <div className="flex-1">
                  <WatchCard watch={getWishlistWatch(item)} />
                </div>
                <button className="mt-4 inline-flex h-11 cursor-pointer items-center justify-center rounded-xl border border-red-100 bg-red-50/50 px-4 text-xs font-medium text-red-600 transition hover:bg-red-50 active:scale-98" type="button" onClick={() => removeItem(item)}>
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
