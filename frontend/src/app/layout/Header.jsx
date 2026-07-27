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
        'fixed inset-x-0 top-0 z-40 border-b transition-all duration-500',
        isScrolled || isMenuOpen
          ? 'border-accent/30 bg-primary/95 shadow-premium backdrop-blur-xl'
          : 'border-white/10 bg-transparent backdrop-blur-[2px]',
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
            className="h-10 w-10 shrink-0 rounded-full bg-white object-cover ring-1 ring-accent/45 transition duration-300 group-hover:ring-accent sm:h-13 sm:w-13"
            src="/logo.jpeg"
          />
          <span className="min-w-0 leading-none">
            <span className="block truncate font-heading text-lg font-bold tracking-wide text-white sm:text-xl">Thilani</span>
            <span className="block truncate text-[10px] font-bold uppercase tracking-[0.2em] text-white/62 transition group-hover:text-accent sm:text-[11px]">Watch Web</span>
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
            <Link className="hidden min-h-12 items-center rounded-full border border-white/15 px-6 text-xs font-bold uppercase tracking-[0.14em] text-white/80 no-underline transition duration-200 hover:border-accent hover:text-accent hover:shadow-premiumSm focus:outline-none focus:ring-2 focus:ring-accent sm:inline-flex" to="/login">
              Login
            </Link>
          )}
          <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 320, damping: 20 }}>
            <Link
              className="hidden min-h-12 items-center rounded-full bg-accent px-7 text-xs font-bold uppercase tracking-[0.14em] text-primary no-underline shadow-goldHairline transition duration-300 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-luxe focus:outline-none focus:ring-2 focus:ring-white sm:inline-flex"
              to="/watches"
            >
              Shop Now
            </Link>
          </motion.div>
          <button
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur transition duration-200 hover:border-accent hover:bg-accent hover:text-primary hover:shadow-premiumSm focus:outline-none focus:ring-2 focus:ring-accent sm:h-12 sm:w-12 lg:hidden"
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
          'fixed right-0 top-[70px] z-30 h-[calc(100vh-70px)] w-[min(290px,86vw)] border-l border-accent/20 bg-primary px-4 py-6 shadow-premium backdrop-blur-xl transition-transform duration-300 sm:top-[94px] sm:h-[calc(100vh-94px)] lg:hidden',
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
        'relative px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white/72 no-underline transition duration-300 after:absolute after:bottom-1 after:left-4 after:h-px after:w-[calc(100%-2rem)] after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100',
        isActive && 'text-white after:scale-x-100',
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
        'min-h-12 rounded-lg border border-transparent px-5 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white/70 no-underline transition duration-200 hover:border-accent/20 hover:bg-accent/10 hover:text-accent',
        isActive && 'border-accent/35 bg-accent/10 text-accent',
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
  <Link className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-white/75 no-underline transition duration-200 hover:bg-accent hover:text-primary hover:shadow-premiumSm focus:outline-none focus:ring-2 focus:ring-accent sm:h-12 sm:w-12" to={to} aria-label={label}>
    {children}
    {count ? <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-accent px-1.5 text-center text-[11px] font-bold text-primary">{count}</span> : null}
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
          ? 'border-accent bg-accent text-primary shadow-premiumSm'
          : 'border-white/15 bg-white/5 text-white/75 hover:border-accent hover:bg-accent hover:text-primary',
      ]
        .filter(Boolean)
        .join(' ')
    }
  >
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold uppercase text-primary">
      {initial || <User className="h-4 w-4" />}
    </span>
    <span className="leading-none">{label}</span>
  </NavLink>
)
