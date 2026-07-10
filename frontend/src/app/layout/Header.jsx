import { useState } from 'react'
import { Heart, Menu, ShoppingBag, User, X } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useCommerce } from '@/features/commerce/hooks/useCommerce'

export const Header = () => {
  const { isAuthenticated } = useAuth()
  const { cart, wishlist } = useCommerce()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const cartCount = cart?.items?.reduce((total, item) => total + Number(item.quantity || 1), 0) || 0

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1280px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="group flex items-center gap-3 no-underline" to="/" onClick={() => setIsMenuOpen(false)}>
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-slate-950 text-lg font-black text-[#D4AF37] shadow-lg shadow-slate-950/15">
            TW
          </span>
          <span>
            <span className="block text-sm font-black uppercase tracking-[0.24em] text-slate-950">Thilani</span>
            <span className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-500 group-hover:text-[#8f6f10]">Watch Web</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          <LuxuryNavLink to="/" end>Store</LuxuryNavLink>
          <LuxuryNavLink to="/watches">Watches</LuxuryNavLink>
          {isAuthenticated && <LuxuryNavLink to="/orders">Orders</LuxuryNavLink>}
          {isAuthenticated && <LuxuryNavLink to="/dashboard">Dashboard</LuxuryNavLink>}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {isAuthenticated ? (
            <>
              <IconLink to="/wishlist" label="Wishlist" count={wishlist?.length}>
                <Heart className="h-5 w-5" />
              </IconLink>
              <IconLink to="/cart" label="Cart" count={cartCount}>
                <ShoppingBag className="h-5 w-5" />
              </IconLink>
              <IconLink to="/dashboard" label="Profile">
                <User className="h-5 w-5" />
              </IconLink>
            </>
          ) : (
            <Link className="hidden min-h-10 items-center rounded-lg bg-slate-950 px-4 text-sm font-extrabold text-white no-underline shadow-lg shadow-slate-950/15 transition hover:bg-[#D4AF37] hover:text-slate-950 sm:inline-flex" to="/login">
              Login
            </Link>
          )}
          <button
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm lg:hidden"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-xl shadow-slate-950/5 lg:hidden">
          <nav className="grid gap-2" aria-label="Mobile navigation">
            <MobileNavLink to="/" end onClick={() => setIsMenuOpen(false)}>Store</MobileNavLink>
            <MobileNavLink to="/watches" onClick={() => setIsMenuOpen(false)}>Watches</MobileNavLink>
            {isAuthenticated ? (
              <>
                <MobileNavLink to="/cart" onClick={() => setIsMenuOpen(false)}>Cart</MobileNavLink>
                <MobileNavLink to="/wishlist" onClick={() => setIsMenuOpen(false)}>Wishlist</MobileNavLink>
                <MobileNavLink to="/orders" onClick={() => setIsMenuOpen(false)}>Orders</MobileNavLink>
                <MobileNavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</MobileNavLink>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" onClick={() => setIsMenuOpen(false)}>Login</MobileNavLink>
                <MobileNavLink to="/register" onClick={() => setIsMenuOpen(false)}>Register</MobileNavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

const LuxuryNavLink = ({ children, ...props }) => (
  <NavLink
    className={({ isActive }) =>
      [
        'rounded-lg px-3 py-2 text-sm font-extrabold text-slate-600 no-underline transition hover:bg-slate-100 hover:text-slate-950',
        isActive && 'bg-slate-950 text-white hover:bg-slate-950 hover:text-white',
      ]
        .filter(Boolean)
        .join(' ')
    }
    {...props}
  >
    {children}
  </NavLink>
)

const MobileNavLink = ({ children, ...props }) => (
  <NavLink
    className={({ isActive }) =>
      [
        'rounded-lg px-3 py-3 text-sm font-extrabold text-slate-700 no-underline',
        isActive && 'bg-slate-950 text-white',
      ]
        .filter(Boolean)
        .join(' ')
    }
    {...props}
  >
    {children}
  </NavLink>
)

const IconLink = ({ children, count, label, to }) => (
  <Link className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-950 no-underline shadow-sm transition hover:border-[#D4AF37] hover:text-[#8f6f10]" to={to} aria-label={label}>
    {children}
    {count ? <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#D4AF37] px-1.5 text-center text-[11px] font-black text-slate-950">{count}</span> : null}
  </Link>
)
