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
    <main className="-mx-4 -mt-8 bg-white sm:-mx-6 lg:-mx-8">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F49006_0%,#EB960E_100%)] px-4 pb-28 pt-16 text-white sm:px-6 sm:pt-20 lg:px-10">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-4 inline-flex min-h-11 items-center rounded-[14px] border border-white bg-white/20 px-5 text-sm font-normal text-white">Saved watches</p>
            <h1 className="text-[44px] font-extrabold leading-[1.1] text-white sm:text-[56px] lg:text-[65px] lg:leading-[71px]">Wishlist</h1>
          </div>
          <Link className="inline-flex min-h-11 w-fit items-center justify-center rounded-[14px] bg-[#121212] px-8 text-sm font-normal text-white no-underline transition hover:bg-[#272222]" to="/watches">
            Browse watches
          </Link>
        </div>
        <svg className="absolute bottom-[-1px] left-0 h-20 w-full text-white" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0 70L60 62.7C120 55 240 41 360 49.3C480 58 600 88 720 92.7C840 98 960 77 1080 63.3C1200 50 1320 44 1380 41.3L1440 39V120H0V70Z" />
        </svg>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-10">
        {(error || actionError) && <div className="mb-5 border border-[#DC3545] bg-red-50 px-4 py-3 font-normal text-[#DC3545]">{actionError || error}</div>}

        {isLoading ? (
          <LoadingState label="Loading saved watches" variant="cards" rows={3} />
        ) : wishlist.length === 0 ? (
          <section className="border border-[#DEE2E6] bg-[#F8F9FA] p-8 text-center">
            <Heart className="mx-auto mb-4 h-12 w-12 text-[#F49006]" />
            <h2 className="mb-2 text-2xl font-bold text-[#121212]">No saved watches yet</h2>
            <p className="mb-5 text-[#212529]">Save favorite watches from listing or detail pages.</p>
            <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center rounded-[14px] bg-[#121212] px-8 text-sm font-normal text-white hover:bg-[#272222]" type="button" onClick={() => navigate('/watches')}>
              Browse watches
            </button>
          </section>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item) => (
              <div className="grid gap-3" key={getWishlistWatchId(item)}>
                <WatchCard watch={getWishlistWatch(item)} />
                <button className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[14px] border border-[#DC3545] bg-red-50 px-4 text-sm font-normal text-[#DC3545] hover:bg-red-100" type="button" onClick={() => removeItem(item)}>
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
