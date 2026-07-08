import { useState } from 'react'
import { Link } from 'react-router'
import { formatMoney, getTitle, getWatchImage } from '../storefront/storefrontUtils'
import { getCartItemWatch, getCartItemWatchId, getStockQuantity } from './commerceUtils'
import { useCommerce } from './useCommerce'

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
    <main>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-extrabold uppercase tracking-normal text-teal-700">Shopping cart</p>
          <h1 className="text-4xl font-bold leading-tight text-slate-950">Your Cart</h1>
        </div>
        <Link className="font-bold text-teal-700 no-underline hover:underline" to="/watches">
          Continue shopping
        </Link>
      </div>

      {(error || actionError) && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{actionError || error}</div>}
      {message && <div className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 font-bold text-emerald-950">{message}</div>}

      {isLoading ? (
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 font-bold text-emerald-950">Loading cart...</div>
      ) : cart.items.length === 0 ? (
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-2 text-2xl font-bold text-slate-950">Your cart is empty</h2>
          <p className="mb-5 text-slate-600">Add a watch from the storefront to start checkout later.</p>
          <Link className="inline-flex min-h-11 w-fit items-center justify-center rounded-lg bg-teal-700 px-4 font-extrabold text-white no-underline hover:bg-teal-800" to="/watches">
            Browse watches
          </Link>
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-3">
            {cart.items.map((item) => (
              <CartItem key={getCartItemWatchId(item)} item={item} onQuantityChange={handleQuantityChange} onRemove={handleRemove} />
            ))}
          </div>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-xl font-bold text-slate-950">Summary</h2>
            <div className="mb-5 flex items-center justify-between gap-3 text-lg">
              <span className="font-bold text-slate-600">Subtotal</span>
              <strong>{formatMoney(cart.subtotal, cart.currency || 'LKR')}</strong>
            </div>
            <Link className="mb-3 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-teal-700 px-4 font-extrabold text-white no-underline hover:bg-teal-800" to="/checkout">
              Checkout
            </Link>
            <button className="mb-3 inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 font-extrabold text-red-800 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={handleClear}>
              Clear cart
            </button>
            <p className="text-sm text-slate-500">Shipping is calculated during checkout.</p>
          </aside>
        </section>
      )}
    </main>
  )
}

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const watch = getCartItemWatch(item)
  const stockQuantity = getStockQuantity(watch)

  return (
    <article className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-[120px_minmax(0,1fr)_160px]">
      <Link to={`/watches/${watch.slug || getCartItemWatchId(item)}`}>
        <img className="aspect-square w-full rounded-lg bg-slate-100 object-cover" src={getWatchImage(watch) || '/favicon.svg'} alt={watch.name || 'Watch'} />
      </Link>
      <div>
        <p className="mb-1 text-xs font-extrabold uppercase text-teal-700">{getTitle(watch.brand, 'Brand')}</p>
        <h2 className="mb-2 text-xl font-bold text-slate-950">
          <Link className="text-slate-950 no-underline hover:text-teal-700" to={`/watches/${watch.slug || getCartItemWatchId(item)}`}>
            {watch.name || 'Untitled watch'}
          </Link>
        </h2>
        <p className="text-sm text-slate-600">Price at time: {formatMoney(item.priceAtTime ?? watch.price, watch.currency)}</p>
        <p className="text-sm text-slate-600">{stockQuantity > 0 ? `${stockQuantity} in stock` : 'Out of stock'}</p>
      </div>
      <div className="grid content-start gap-3">
        <label className="grid gap-2 text-sm font-extrabold text-slate-700">
          Quantity
          <input
            className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15"
            defaultValue={item.quantity || 1}
            max={stockQuantity || undefined}
            min="1"
            type="number"
            onBlur={(event) => onQuantityChange(item, event.target.value)}
          />
        </label>
        <button className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 font-extrabold text-slate-950 hover:bg-slate-50" type="button" onClick={() => onRemove(item)}>
          Remove
        </button>
      </div>
    </article>
  )
}
