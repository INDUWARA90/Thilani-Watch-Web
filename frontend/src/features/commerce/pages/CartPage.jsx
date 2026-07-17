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
    <main className="-mx-4 -mt-8 bg-white sm:-mx-6 lg:-mx-8 min-h-screen pb-16">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F49006_0%,#EB960E_100%)] px-4 pb-32 pt-16 text-white sm:px-6 sm:pt-20 lg:px-10">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between relative z-10">
          <div className="max-w-xl">
            <p className="mb-3 inline-flex min-h-9 items-center rounded-full border border-white/30 bg-white/10 px-4 text-xs font-medium tracking-wide uppercase text-white backdrop-blur-sm">
              Shopping cart
            </p>
            <h1 className="text-[44px] font-black leading-[1.1] text-white sm:text-[56px] lg:text-[65px] lg:leading-[71px] tracking-tight">
              Your Cart
            </h1>
            <p className="mt-3 text-sm font-normal text-white/80 sm:text-base leading-relaxed">
              Review your selected timepieces, adjust quantities, or proceed to secure checkout to make them yours.
            </p>
          </div>
          <Link className="inline-flex min-h-11 w-fit items-center justify-center rounded-[14px] bg-[#121212] px-8 text-sm font-medium text-white no-underline transition shadow-sm hover:bg-[#272222] active:scale-98 shrink-0 sm:mb-2" to="/watches">
            Continue shopping
          </Link>
        </div>
        <svg className="absolute bottom-[-1px] left-0 h-20 w-full text-white" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0 70L60 62.7C120 55 240 41 360 49.3C480 58 600 88 720 92.7C840 98 960 77 1080 63.3C1200 50 1320 44 1380 41.3L1440 39V120H0V70Z" />
        </svg>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-10">
        {(error || actionError) && <div className="mb-6 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3.5 font-medium text-red-600 shadow-sm">{actionError || error}</div>}
        {message && <div className="mb-6 rounded-[14px] border border-green-200 bg-green-50 px-4 py-3.5 font-medium text-green-700 shadow-sm">{message}</div>}

        {isLoading ? (
          <LoadingState label="Refreshing your cart" variant="form" />
        ) : cart.items.length === 0 ? (
          <section className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm max-w-2xl mx-auto my-8">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
              <ShoppingBag className="h-8 w-8 text-[#F49006]" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-[#121212]">Your cart is empty</h2>
            <p className="mb-6 text-slate-500 max-w-sm mx-auto">Add a premium watch from our storefront collection to get started with checkout.</p>
            <Link className="inline-flex min-h-11 w-fit items-center justify-center rounded-[14px] bg-[#121212] px-8 text-sm font-medium text-white no-underline transition hover:bg-[#272222]" to="/watches">
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

            <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] lg:sticky lg:top-28">
              <h2 className="mb-5 text-xl font-bold text-[#121212] border-b border-slate-100 pb-4">Order Summary</h2>
              <div className="mb-6 flex items-center justify-between gap-3 text-lg">
                <span className="font-normal text-slate-500">Subtotal</span>
                <strong className="text-xl font-extrabold text-[#121212]">{formatMoney(cart.subtotal, cart.currency || 'LKR')}</strong>
              </div>
              <div className="flex flex-col gap-3">
                <Link className="inline-flex min-h-12 w-full items-center justify-center rounded-[14px] bg-[#121212] px-8 text-sm font-medium text-white no-underline transition hover:bg-[#272222] shadow-sm active:scale-98" to="/checkout">
                  Proceed to Checkout
                </Link>
                <button className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-[14px] border border-red-200 bg-red-50/50 px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 active:scale-98 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={handleClear}>
                  Clear cart
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-5 text-center">Shipping & taxes calculated during checkout.</p>
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
    <article className="flex flex-col sm:flex-row gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition duration-200 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:border-slate-200">
      <Link className="shrink-0" to={`/watches/${watch.slug || getCartItemWatchId(item)}`}>
        <img className="aspect-square h-28 w-28 sm:h-32 sm:w-32 rounded-xl bg-slate-50 object-cover border border-slate-100" src={getWatchImage(watch) || '/favicon.svg'} alt={watch.name || 'Watch'} />
      </Link>

      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide uppercase text-[#F49006]">{getTitle(watch.brand, 'Brand')}</p>
          <h2 className="mb-2 text-xl font-bold text-[#121212] leading-snug">
            <Link className="text-[#121212] no-underline transition hover:text-[#F49006]" to={`/watches/${watch.slug || getCartItemWatchId(item)}`}>
              {watch.name || 'Untitled watch'}
            </Link>
          </h2>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-slate-500">
          <p>Unit Price: <span className="font-medium text-slate-800">{formatMoney(item.priceAtTime ?? watch.price, watch.currency)}</span></p>
          <p className={`font-medium ${stockQuantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {stockQuantity > 0 ? `${stockQuantity} in stock` : 'Out of stock'}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between sm:flex-col sm:items-end sm:justify-start gap-4 shrink-0 border-t border-slate-100 pt-4 sm:border-t-0 sm:pt-0">
        <label className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5 text-sm font-medium text-slate-500">
          <span>Quantity</span>
          <input
            className="h-10 w-20 rounded-xl border border-slate-200 bg-white px-3 text-center font-semibold text-[#121212] outline-none transition focus:border-[#0D6EFD] focus:ring-2 focus:ring-[#0D6EFD]/25"
            defaultValue={item.quantity || 1}
            max={stockQuantity || undefined}
            min="1"
            type="number"
            onBlur={(event) => onQuantityChange(item, event.target.value)}
          />
        </label>
        <button className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50/50 px-4 text-xs font-medium text-red-600 transition hover:bg-red-50 active:scale-95" type="button" onClick={() => onRemove(item)}>
          <Trash2 className="h-3.5 w-3.5" /> Remove
        </button>
      </div>
    </article>
  )
}
