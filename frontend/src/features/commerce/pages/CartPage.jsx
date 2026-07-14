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
    <main className="-mx-4 -mt-8 bg-white sm:-mx-6 lg:-mx-8">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F49006_0%,#EB960E_100%)] px-4 pb-28 pt-16 text-white sm:px-6 sm:pt-20 lg:px-10">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-4 inline-flex min-h-11 items-center rounded-[14px] border border-white bg-white/20 px-5 text-sm font-normal text-white">Shopping cart</p>
            <h1 className="text-[44px] font-extrabold leading-[1.1] text-white sm:text-[56px] lg:text-[65px] lg:leading-[71px]">Your Cart</h1>
          </div>
          <Link className="inline-flex min-h-11 w-fit items-center justify-center rounded-[14px] bg-[#121212] px-8 text-sm font-normal text-white no-underline transition hover:bg-[#272222]" to="/watches">
            Continue shopping
          </Link>
        </div>
        <svg className="absolute bottom-[-1px] left-0 h-20 w-full text-white" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0 70L60 62.7C120 55 240 41 360 49.3C480 58 600 88 720 92.7C840 98 960 77 1080 63.3C1200 50 1320 44 1380 41.3L1440 39V120H0V70Z" />
        </svg>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-10">
        {(error || actionError) && <div className="mb-5 border border-[#DC3545] bg-red-50 px-4 py-3 font-normal text-[#DC3545]">{actionError || error}</div>}
        {message && <div className="mb-5 border border-[#198754] bg-green-50 px-4 py-3 font-normal text-[#198754]">{message}</div>}

        {isLoading ? (
          <LoadingState label="Refreshing your cart" variant="form" />
        ) : cart.items.length === 0 ? (
          <section className="border border-dashed border-[#DEE2E6] bg-[#F8F9FA] p-8 text-center">
            <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-[#F49006]" />
            <h2 className="mb-2 text-2xl font-bold text-[#121212]">Your cart is empty</h2>
            <p className="mb-5 text-[#212529]">Add a watch from the storefront to start checkout later.</p>
            <Link className="inline-flex min-h-11 w-fit items-center justify-center rounded-[14px] bg-[#121212] px-8 text-sm font-normal text-white no-underline transition hover:bg-[#272222]" to="/watches">
              Browse watches
            </Link>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="grid gap-4">
              {cart.items.map((item) => (
                <CartItem key={getCartItemWatchId(item)} item={item} onQuantityChange={handleQuantityChange} onRemove={handleRemove} />
              ))}
            </div>

            <aside className="h-fit border border-[#DEE2E6] bg-white p-5 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)] lg:sticky lg:top-28">
              <h2 className="mb-4 text-xl font-bold text-[#121212]">Summary</h2>
              <div className="mb-5 flex items-center justify-between gap-3 text-lg">
                <span className="font-normal text-[#6C757D]">Subtotal</span>
                <strong className="text-[#121212]">{formatMoney(cart.subtotal, cart.currency || 'LKR')}</strong>
              </div>
              <Link className="mb-3 inline-flex min-h-11 w-full items-center justify-center rounded-[14px] bg-[#121212] px-8 text-sm font-normal text-white no-underline transition hover:bg-[#272222]" to="/checkout">
                Checkout
              </Link>
              <button className="mb-3 inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-[14px] border border-[#DC3545] bg-red-50 px-4 text-sm font-normal text-[#DC3545] hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={handleClear}>
                Clear cart
              </button>
              <p className="text-sm text-[#6C757D]">Shipping is calculated during checkout.</p>
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
    <article className="grid gap-4 border border-[#DEE2E6] bg-white p-4 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)] transition hover:shadow-[16px_18px_16px_0_rgba(0,0,0,0.1)] sm:grid-cols-[120px_minmax(0,1fr)_170px]">
      <Link to={`/watches/${watch.slug || getCartItemWatchId(item)}`}>
        <img className="aspect-square w-full rounded-[20px] bg-[#F8F9FA] object-cover" src={getWatchImage(watch) || '/favicon.svg'} alt={watch.name || 'Watch'} />
      </Link>
      <div>
        <p className="mb-1 text-sm font-normal text-[#F49006]">{getTitle(watch.brand, 'Brand')}</p>
        <h2 className="mb-2 text-xl font-bold text-[#121212]">
          <Link className="text-[#121212] no-underline hover:text-[#F49006]" to={`/watches/${watch.slug || getCartItemWatchId(item)}`}>
            {watch.name || 'Untitled watch'}
          </Link>
        </h2>
        <p className="text-sm text-[#212529]">Price at time: {formatMoney(item.priceAtTime ?? watch.price, watch.currency)}</p>
        <p className="text-sm text-[#212529]">{stockQuantity > 0 ? `${stockQuantity} in stock` : 'Out of stock'}</p>
      </div>
      <div className="grid content-start gap-3">
        <label className="grid gap-2 text-base font-normal text-[#121212]">
          Quantity
          <input
            className="min-h-[45px] min-w-0 border border-[#DEE2E6] bg-white px-[15px] text-[#121212] outline-none focus:border-[#0D6EFD] focus:ring-2 focus:ring-[#0D6EFD]/25"
            defaultValue={item.quantity || 1}
            max={stockQuantity || undefined}
            min="1"
            type="number"
            onBlur={(event) => onQuantityChange(item, event.target.value)}
          />
        </label>
        <button className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-[#DC3545] bg-red-50 px-4 text-sm font-normal text-[#DC3545] hover:bg-red-100" type="button" onClick={() => onRemove(item)}>
          <Trash2 className="h-4 w-4" /> Remove
        </button>
      </div>
    </article>
  )
}
