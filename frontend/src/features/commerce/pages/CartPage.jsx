import { useState } from 'react'
import { ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { LoadingState } from '@/shared/ui/LoadingState'
import { formatMoney, getTitle, getWatchImage } from '@/features/storefront/lib/storefrontUtils'
import { getCartItemWatch, getCartItemWatchId, getStockQuantity } from '@/features/commerce/lib/commerceUtils'
import { useCommerce } from '@/features/commerce/hooks/useCommerce'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
export const CartPage = () => {
  usePageTitle('My cart | Thilani Watch Web')
  const { cart, clearCart, error, isLoading, removeFromCart, updateCartQuantity } = useCommerce()
  const [message, setMessage] = useState('')
  const [actionError, setActionError] = useState('')

  const handleQuantityChange = async (item, value) => {
    setActionError('')
    setMessage('')
    try {
      await updateCartQuantity(item, value)
      setMessage('Cart updated successfully.')
    } catch (updateError) {
      setActionError(updateError.message)
    }
  }

  const handleRemove = async (item) => {
    setActionError('')
    setMessage('')
    try {
      await removeFromCart(item)
      setMessage('Item removed from cart.')
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
    <main className="min-h-screen bg-base pb-24 text-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-100/80 via-base to-base px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-10 border-b border-black/5">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[700px] rounded-full bg-gradient-to-tr from-amber-200/20 via-orange-100/10 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-[1200px] min-w-0 flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl min-w-0">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/85 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              Secure Bag
            </div>
            <h1 className="break-words font-heading text-[42px] font-extrabold tracking-tight leading-[1.05] text-black sm:text-[60px] lg:text-[76px]">
              Your Cart
            </h1>
            <p className="mt-4 text-base font-normal leading-relaxed text-stone-600 sm:text-lg">
              Review your selected timepieces, adjust quantities, or proceed to secure checkout to make them yours.
            </p>
          </div>

          <Link
            className="group inline-flex min-h-12 w-full max-w-full shrink-0 items-center justify-center gap-2.5 rounded-full bg-black px-7 text-sm font-bold text-white no-underline shadow-lg shadow-black/10 transition-all duration-300 hover:bg-stone-800 hover:shadow-xl active:scale-98 sm:mb-2 sm:w-fit"
            to="/watches"
          >
            Continue shopping
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Main Container */}
      <section className="mx-auto max-w-[1200px] px-4 pt-10 sm:px-6 lg:px-10">
        {(error || actionError) && (
          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 font-medium text-red-700 shadow-sm backdrop-blur-sm">
            {actionError || error}
          </div>
        )}
        {message && (
          <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 font-medium text-emerald-800 shadow-sm backdrop-blur-sm">
            {message}
          </div>
        )}

        {isLoading ? (
          <div className="py-12">
            <LoadingState label="Refreshing your cart" variant="form" />
          </div>
        ) : cart.items.length === 0 ? (
          <section className="mx-auto my-12 max-w-xl rounded-3xl border border-dashed border-black/15 bg-white/60 p-8 text-center shadow-xl shadow-black/[0.02] backdrop-blur-md sm:p-14">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-black/5 shadow-inner">
              <ShoppingBag className="h-9 w-9 text-stone-700" />
            </div>
            <h2 className="mb-3 font-heading text-2xl font-bold tracking-tight text-black">Your cart is empty</h2>
            <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-stone-600">
              Add a premium watch from our storefront collection to get started with checkout.
            </p>
            <Link
              className="inline-flex min-h-12 w-fit items-center justify-center rounded-full bg-black px-8 text-sm font-bold text-white no-underline transition-all duration-300 hover:bg-stone-800 hover:shadow-lg active:scale-98"
              to="/watches"
            >
              Browse watches
            </Link>
          </section>
        ) : (
          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            {/* Cart Items List */}
            <div className="flex flex-col gap-5">
              {cart.items.map((item) => (
                <CartItem key={getCartItemWatchId(item)} item={item} onQuantityChange={handleQuantityChange} onRemove={handleRemove} />
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <aside className="h-fit rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] lg:sticky lg:top-28">
              <h2 className="mb-5 border-b border-black/10 pb-4 font-heading text-xl font-bold tracking-tight text-black">
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-600 font-medium">Subtotal</span>
                  <span className="font-mono text-base font-bold text-black">{formatMoney(cart.subtotal, cart.currency || 'LKR')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-600 font-medium">Estimated Shipping</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">At Checkout</span>
                </div>
              </div>

              <div className="border-t border-black/10 pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black text-base">Total</span>
                  <strong className="font-heading text-2xl font-extrabold text-black font-mono">
                    {formatMoney(cart.subtotal, cart.currency || 'LKR')}
                  </strong>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-8 text-sm font-bold text-white no-underline shadow-lg shadow-black/10 transition-all duration-300 hover:bg-stone-800 hover:shadow-xl active:scale-98"
                  to="/checkout"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full border border-red-500/20 bg-red-500/5 px-4 text-xs font-bold text-red-600 transition-all duration-200 hover:bg-red-500 hover:text-white active:scale-98 disabled:cursor-not-allowed disabled:opacity-65"
                  type="button"
                  onClick={handleClear}
                >
                  Clear cart
                </button>
              </div>
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
    <article className="group flex min-w-0 flex-col gap-5 rounded-3xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-black/25 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center sm:p-6">
      <Link className="shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-stone-50" to={`/watches/${watch.slug || getCartItemWatchId(item)}`}>
        <img
          className="aspect-square h-28 w-full object-cover transition-transform duration-500 group-hover:scale-105 min-[420px]:w-28 sm:h-32 sm:w-32"
          src={getWatchImage(watch) || '/favicon.svg'}
          alt={watch.name || 'Watch'}
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-600">{getTitle(watch.brand, 'Brand')}</p>
          <h2 className="mb-2 font-heading text-lg font-bold leading-snug tracking-tight text-black sm:text-xl">
            <Link className="text-black no-underline transition hover:text-stone-600" to={`/watches/${watch.slug || getCartItemWatchId(item)}`}>
              {watch.name || 'Untitled watch'}
            </Link>
          </h2>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
          <p className="font-medium text-stone-600">
            Unit Price: <span className="font-mono font-bold text-black">{formatMoney(item.priceAtTime ?? watch.price, watch.currency)}</span>
          </p>
          <p className={`inline-flex items-center gap-1.5 font-semibold ${stockQuantity > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${stockQuantity > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {stockQuantity > 0 ? `${stockQuantity} in stock` : 'Out of stock'}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-3 border-t border-black/10 pt-4 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:pt-0">
        <label className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wider text-stone-600 min-[420px]:justify-start sm:flex-col sm:items-end sm:gap-1.5">
          <span>Quantity</span>
          <input
            className="h-11 w-20 rounded-2xl border border-black/15 bg-stone-50 px-3 text-center font-mono text-sm font-bold text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10"
            defaultValue={item.quantity || 1}
            max={stockQuantity || undefined}
            min="1"
            type="number"
            onBlur={(event) => onQuantityChange(item, event.target.value)}
          />
        </label>
        <button
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 text-xs font-bold text-red-600 transition-all duration-200 hover:bg-red-500 hover:text-white active:scale-95"
          type="button"
          onClick={() => onRemove(item)}
        >
          <Trash2 className="h-3.5 w-3.5" /> Remove
        </button>
      </div>
    </article>
  )
}
