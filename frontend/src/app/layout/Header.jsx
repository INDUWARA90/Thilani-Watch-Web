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
    <header className="sticky top-0 z-40 border-b border-[#DEE2E6] bg-white">
      <div className="mx-auto flex w-full max-w-[1200px] items-center gap-4 px-4 py-5 sm:px-6 lg:px-10">
        <Link className="group flex items-center gap-3 no-underline" to="/" onClick={() => setIsMenuOpen(false)}>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#F49006] text-lg font-extrabold text-white">
            TW
          </span>
          <span>
            <span className="block text-base font-extrabold text-[#121212]">Thilani</span>
            <span className="block text-sm font-normal text-[#6C757D] group-hover:text-[#F49006]">Watch Web</span>
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
            <Link className="hidden min-h-11 items-center rounded-[14px] bg-[#121212] px-8 text-sm font-normal text-white no-underline transition hover:bg-[#272222] active:scale-[0.98] sm:inline-flex" to="/login">
              Login
            </Link>
          )}
          <button
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-[14px] border border-[#DEE2E6] bg-white text-[#121212] lg:hidden"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-[#DEE2E6] bg-white px-4 py-4 lg:hidden">
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
        'min-h-11 px-3 py-2 text-base font-normal text-[#121212] no-underline transition hover:text-[#F49006]',
        isActive && 'border-b-2 border-[#F49006] text-[#F49006]',
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
        'min-h-12 px-5 py-4 text-base font-normal text-[#121212] no-underline hover:bg-[rgba(244,144,6,0.1)] hover:text-[#F49006]',
        isActive && 'bg-[rgba(244,144,6,0.1)] text-[#F49006]',
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
  <Link className="relative inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-transparent text-[#121212] no-underline transition hover:bg-[rgba(244,144,6,0.1)] hover:text-[#F49006]" to={to} aria-label={label}>
    {children}
    {count ? <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#F49006] px-1.5 text-center text-[11px] font-normal text-white">{count}</span> : null}
  </Link>
)
