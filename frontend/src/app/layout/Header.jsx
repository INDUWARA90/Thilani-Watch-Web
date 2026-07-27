import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Menu, ShoppingBag, User, X } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useCommerce } from '@/features/commerce/hooks/useCommerce'

export const Header = () => {
  const { isAdmin, isAuthenticated, user } = useAuth()
  const { cart, wishlist } = useCommerce()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const cartCount = getCartCount(cart)
  const accountLabel = isAdmin ? 'Admin' : 'Account'
  const accountInitial = (user?.name || user?.email || 'User').trim().charAt(0).toUpperCase()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      animate={{ y: 0, opacity: 1 }}
      className={[
        'sticky top-0 z-40 border-b transition-all duration-500',
        isScrolled
          ? 'border-white/12 bg-black/75 shadow-[0_18px_45px_rgba(0,0,0,0.45),0_0_22px_rgba(255,255,255,0.08)] backdrop-blur-xl'
          : 'border-white/[0.04] bg-black/20 backdrop-blur-sm',
      ]
        .filter(Boolean)
        .join(' ')}
      initial={{ y: -18, opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-3 sm:gap-4 sm:px-6 sm:py-5 lg:px-10">
        <Link className="group flex min-w-0 items-center gap-2 no-underline sm:gap-3" to="/" onClick={() => setIsMenuOpen(false)}>
          <img
            alt="Thilani Watch Center logo"
            className="h-10 w-10 shrink-0 rounded-full bg-white object-cover ring-1 ring-white/20 transition group-hover:ring-white/55 sm:h-13 sm:w-13"
            src="/logo.jpeg"
          />
          <span className="min-w-0 leading-none">
            <span className="block truncate font-heading text-base font-bold text-white sm:text-lg">Thilani</span>
            <span className="block truncate text-[11px] font-medium text-white/70 transition group-hover:text-white sm:text-[13px]">Watch Web</span>
          </span>
        </Link>

        <nav className="hidden items-center justify-center gap-1 lg:flex" aria-label="Primary navigation">
          <LuxuryNavLink to="/" end>Home</LuxuryNavLink>
          <LuxuryNavLink to="/watches">Watches</LuxuryNavLink>
          <LuxuryNavLink to="/about">About</LuxuryNavLink>
          <LuxuryNavLink to="/contact">Contact</LuxuryNavLink>
          {isAuthenticated && <LuxuryNavLink to="/orders">Orders</LuxuryNavLink>}
        </nav>

        <div className="ml-auto flex items-center justify-end gap-1.5 sm:gap-2 lg:ml-0">
          {isAuthenticated ? (
            <>
              <IconLink to="/wishlist" label="Wishlist" count={wishlist?.length}>
                <Heart className="h-5 w-5" />
              </IconLink>
              <IconLink to="/cart" label="Cart" count={cartCount}>
                <ShoppingBag className="h-5 w-5" />
              </IconLink>
              <AccountLink initial={accountInitial} label={accountLabel} />
            </>
          ) : (
            <Link className="hidden min-h-12 items-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white/80 no-underline transition hover:border-white/45 hover:text-white hover:shadow-glowSm sm:inline-flex" to="/login">
              Login
            </Link>
          )}
          <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 320, damping: 20 }}>
            <Link
              className="hidden min-h-12 items-center rounded-full bg-white px-6 text-sm font-bold text-black no-underline shadow-glowSm transition hover:shadow-glow sm:inline-flex"
              to="/watches"
            >
              Shop Now
            </Link>
          </motion.div>
          <button
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur transition hover:border-white/35 hover:bg-white/10 hover:shadow-glowSm sm:h-12 sm:w-12 lg:hidden"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Background Overlay to close drawer when clicking outside */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden" 
          onClick={() => setIsMenuOpen(false)} 
        />
      )}

      {/* Right side drawer container */}
      <div 
        className={[
          'fixed top-[70px] right-0 z-30 h-[calc(100vh-70px)] w-[min(290px,86vw)] border-l border-white/10 bg-black/85 px-4 py-6 shadow-glowSm backdrop-blur-xl transition-transform duration-300 sm:top-[94px] sm:h-[calc(100vh-94px)] lg:hidden',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        ].join(' ')}
      >
        <nav className="grid gap-2" aria-label="Mobile navigation">
          <MobileNavLink to="/" end onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
          <MobileNavLink to="/watches" onClick={() => setIsMenuOpen(false)}>Watches</MobileNavLink>
          <MobileNavLink to="/about" onClick={() => setIsMenuOpen(false)}>About</MobileNavLink>
          <MobileNavLink to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</MobileNavLink>
          <MobileNavLink to="/faq" onClick={() => setIsMenuOpen(false)}>FAQ</MobileNavLink>
          <MobileNavLink to="/policy" onClick={() => setIsMenuOpen(false)}>Policy</MobileNavLink>
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
    </motion.header>
  )
}

const LuxuryNavLink = ({ children, ...props }) => (
  <NavLink
    className={({ isActive }) =>
      [
        'rounded-full px-5 py-2.5 text-[15px] font-semibold text-white/75 no-underline transition hover:bg-white/5 hover:text-white hover:shadow-glowSm',
        isActive && 'bg-white/10 text-white shadow-glowSm',
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
        'min-h-12 rounded-lg px-5 py-4 text-base font-semibold text-white/70 no-underline transition hover:bg-white/10 hover:text-white',
        isActive && 'bg-white/10 text-white shadow-glowSm',
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
  <Link className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-white/75 no-underline transition hover:bg-white/10 hover:text-white hover:shadow-glowSm sm:h-12 sm:w-12" to={to} aria-label={label}>
    {children}
    {count ? <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-white px-1.5 text-center text-[11px] font-bold text-black">{count}</span> : null}
  </Link>
)

const getCartCount = (cart) => {
  let count = 0

  for (const item of cart?.items || []) {
    count += Number(item.quantity || 1)
  }

  return count
}

const AccountLink = ({ initial, label }) => (
  <NavLink
    to="/dashboard"
    aria-label="Dashboard"
    className={({ isActive }) =>
      [
        'hidden h-12 items-center gap-2 rounded-[14px] border px-2.5 pr-4 text-sm font-semibold no-underline transition sm:inline-flex',
        isActive
          ? 'border-white/40 bg-white/10 text-white shadow-glowSm'
          : 'border-white/15 bg-white/5 text-white/75 hover:border-white/40 hover:bg-white/10 hover:text-white',
      ]
        .filter(Boolean)
        .join(' ')
    }
  >
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-xs font-bold uppercase text-black">
      {initial || <User className="h-4 w-4" />}
    </span>
    <span className="leading-none">{label}</span>
  </NavLink>
)
