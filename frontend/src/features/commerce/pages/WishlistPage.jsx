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
    <main>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-extrabold uppercase tracking-normal text-teal-700">Saved watches</p>
          <h1 className="text-4xl font-bold leading-tight text-slate-950">Wishlist</h1>
        </div>
        <Link className="font-bold text-teal-700 no-underline hover:underline" to="/watches">
          Browse watches
        </Link>
      </div>

      {(error || actionError) && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{actionError || error}</div>}

      {isLoading ? (
        <LoadingState label="Loading saved watches" variant="cards" rows={3} />
      ) : wishlist.length === 0 ? (
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-2 text-2xl font-bold text-slate-950">No saved watches yet</h2>
          <p className="mb-5 text-slate-600">Save favorite watches from listing or detail pages.</p>
          <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center rounded-lg bg-teal-700 px-4 font-extrabold text-white hover:bg-teal-800" type="button" onClick={() => navigate('/watches')}>
            Browse watches
          </button>
        </section>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <div className="grid gap-3" key={getWishlistWatchId(item)}>
              <WatchCard watch={getWishlistWatch(item)} />
              <button className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 font-extrabold text-red-800 hover:bg-red-100" type="button" onClick={() => removeItem(item)}>
                Remove from wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
