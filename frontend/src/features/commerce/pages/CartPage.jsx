import { useState } from 'react'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { LoadingState } from '@/shared/ui/LoadingState'
import { formatMoney, getTitle, getWatchImage } from '@/features/storefront/lib/storefrontUtils'
import { getCartItemWatch, getCartItemWatchId, getStockQuantity } from '@/features/commerce/lib/commerceUtils'
import { useCommerce } from '@/features/commerce/hooks/useCommerce'

export const CartPage = () => {
  const { cart, clearCart, error, isLoading, removeFromCart, updateCartQuantity } = useCommerce()
  const [message, setMessage] = useState('')
  const [actionError, setActionError] = useState('')

  const handleQuantityChange = async (item, value) => {
    setActionError('')
    setMessage('')
    try {
      await updateCartQuantity(item, value)
      setMessage('Cart updated.')
    } catch (updateError) {
      setActionError(updateError.message)
    }
  }

  const handleRemove = async (item) => {
    setActionError('')
    setMessage('')
    try {
      await removeFromCart(item)
      setMessage('Item removed.')
    } catch (removeError) {
      setActionError(removeError.message)
    }
  }

  const handleClear = async () => {
    setActionError('')
    setMessage('')
    try {
      await clearCart()
      setMessage('Cart cleared.')
    } catch (clearError) {
      setActionError(clearError.message)
    }
  }

  return (
    <main className="min-h-screen bg-base pb-16 text-white">
      <section className="relative overflow-hidden bg-base px-4 pb-28 pt-20 text-white sm:px-6 sm:pt-24 lg:px-10">
        <div className="relative z-10 mx-auto flex max-w-[1200px] min-w-0 flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl min-w-0">
            <p className="mb-4 inline-flex min-h-9 items-center rounded-full border border-white/15 bg-white/5 px-4 text-xs font-semibold uppercase text-white/75 backdrop-blur-sm">
              Shopping cart
            </p>
            <h1 className="break-words font-heading text-[40px] font-bold leading-[1.05] text-white sm:text-[56px] lg:text-[72px]">
              Your Cart
            </h1>
            <p className="mt-4 text-sm font-normal leading-relaxed text-white/75 sm:text-base">
              Review your selected timepieces, adjust quantities, or proceed to secure checkout to make them yours.
            </p>
          </div>
          <Link className="inline-flex min-h-11 w-full max-w-full shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-bold text-white no-underline shadow-sm transition hover:border-white/45 hover:shadow-glowSm active:scale-98 sm:mb-2 sm:w-fit sm:px-8" to="/watches">
            Continue shopping
          </Link>
        </div>
        <div className="pointer-events-none absolute bottom-8 left-1/2 h-24 w-[min(980px,92vw)] -translate-x-1/2" aria-hidden="true">
          <div className="glow-beam absolute left-0 top-1/2 h-px w-full bg-white/70 shadow-glow" />
          <div className="glow-beam absolute left-1/2 top-4 h-28 w-[80%] -translate-x-1/2 rounded-[50%] border-t border-white/45" />
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-10">
        {(error || actionError) && <div className="mb-6 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3.5 font-medium text-red-200 shadow-sm">{actionError || error}</div>}
        {message && <div className="mb-6 rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-4 py-3.5 font-medium text-emerald-200 shadow-sm">{message}</div>}

        {isLoading ? (
          <LoadingState label="Refreshing your cart" variant="form" />
        ) : cart.items.length === 0 ? (
          <section className="mx-auto my-8 max-w-2xl rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-6 text-center shadow-sm sm:p-12">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-2 font-heading text-2xl font-bold text-white">Your cart is empty</h2>
            <p className="mx-auto mb-6 max-w-sm text-white/65">Add a premium watch from our storefront collection to get started with checkout.</p>
            <Link className="inline-flex min-h-11 w-fit items-center justify-center rounded-full bg-white px-8 text-sm font-bold text-black no-underline transition hover:shadow-glow" to="/watches">
              Browse watches
            </Link>
          </section>
        ) : (
          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="flex flex-col gap-4">
              {cart.items.map((item) => (
                <CartItem key={getCartItemWatchId(item)} item={item} onQuantityChange={handleQuantityChange} onRemove={handleRemove} />
              ))}
            </div>

            <aside className="h-fit rounded-lg border border-white/12 bg-surface p-6 shadow-glowSm lg:sticky lg:top-28">
              <h2 className="mb-5 border-b border-white/10 pb-4 font-heading text-xl font-bold text-white">Order Summary</h2>
              <div className="mb-6 flex items-center justify-between gap-3 text-lg">
                <span className="font-normal text-white/65">Subtotal</span>
                <strong className="font-heading text-xl font-bold text-white">{formatMoney(cart.subtotal, cart.currency || 'LKR')}</strong>
              </div>
              <div className="flex flex-col gap-3">
                <Link className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-8 text-sm font-bold text-black no-underline shadow-sm transition hover:shadow-glow active:scale-98" to="/checkout">
                  Proceed to Checkout
                </Link>
                <button className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full border border-red-400/25 bg-red-500/10 px-4 text-sm font-bold text-red-200 transition hover:bg-red-500/20 active:scale-98 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={handleClear}>
                  Clear cart
                </button>
              </div>
              <p className="mt-5 text-center text-xs text-white/75">Shipping & taxes calculated during checkout.</p>
            </aside>
          </section>
        )}
      </section>
    </main>
  )
}

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const watch = getCartItemWatch(item)
  const stockQuantity = getStockQuantity(watch)

  return (
    <article className="flex min-w-0 flex-col gap-5 rounded-lg border border-white/12 bg-surface p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition duration-200 hover:border-white/30 hover:shadow-glowSm sm:flex-row sm:p-5">
      <Link className="shrink-0" to={`/watches/${watch.slug || getCartItemWatchId(item)}`}>
        <img className="aspect-square h-28 w-full rounded-lg border border-white/12 bg-black/35 object-cover min-[420px]:w-28 sm:h-32 sm:w-32" src={getWatchImage(watch) || '/favicon.svg'} alt={watch.name || 'Watch'} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase text-white/65">{getTitle(watch.brand, 'Brand')}</p>
          <h2 className="mb-2 font-heading text-xl font-bold leading-snug text-white">
            <Link className="text-white no-underline transition hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" to={`/watches/${watch.slug || getCartItemWatchId(item)}`}>
              {watch.name || 'Untitled watch'}
            </Link>
          </h2>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/65">
          <p>Unit Price: <span className="font-medium text-white">{formatMoney(item.priceAtTime ?? watch.price, watch.currency)}</span></p>
          <p className={`font-medium ${stockQuantity > 0 ? 'text-emerald-200' : 'text-red-200'}`}>
            {stockQuantity > 0 ? `${stockQuantity} in stock` : 'Out of stock'}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-3 border-t border-white/10 pt-4 min-[420px]:flex-row min-[420px]:items-end min-[420px]:justify-between sm:flex-col sm:items-end sm:justify-start sm:border-t-0 sm:pt-0">
        <label className="flex items-center justify-between gap-3 text-sm font-medium text-white/65 min-[420px]:justify-start sm:flex-col sm:items-end sm:gap-1.5">
          <span>Quantity</span>
          <input
            className="h-10 w-20 rounded-lg border border-white/12 bg-black/35 px-3 text-center font-semibold text-white outline-none transition focus:border-white/45 focus:ring-2 focus:ring-white/10"
            defaultValue={item.quantity || 1}
            max={stockQuantity || undefined}
            min="1"
            type="number"
            onBlur={(event) => onQuantityChange(item, event.target.value)}
          />
        </label>
        <button className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-4 text-xs font-bold text-red-200 transition hover:bg-red-500/20 active:scale-95" type="button" onClick={() => onRemove(item)}>
          <Trash2 className="h-3.5 w-3.5" /> Remove
        </button>
      </div>
    </article>
  )
}
