import { useState } from 'react'
import { Heart, Menu, ShoppingBag, User, X } from 'lucide-react'
import { Link, NavLink, Navigate, Route, Routes } from 'react-router'
import { AdminCatalogPage } from '@/features/admin/pages/AdminCatalogPage'
import { AdminLayout, RequireAdmin } from '@/features/admin/layout/AdminLayout'
import { AdminOrderDetailPage, AdminOrdersPage } from '@/features/admin/pages/AdminOrdersPage'
import { AdminOverviewPage } from '@/features/admin/pages/AdminOverviewPage'
import { AdminProductsPage } from '@/features/admin/pages/AdminProductsPage'
import { AdminReviewsPage } from '@/features/admin/pages/AdminReviewsPage'
import { AuthProvider } from '@/features/auth/providers/AuthContext'
import { DashboardPage } from '@/features/auth/pages/DashboardPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { CartPage } from '@/features/commerce/pages/CartPage'
import { CommerceProvider } from '@/features/commerce/providers/CommerceProvider'
import { useCommerce } from '@/features/commerce/hooks/useCommerce'
import { WishlistPage } from '@/features/commerce/pages/WishlistPage'
import { CheckoutPage } from '@/features/orders/pages/CheckoutPage'
import { MyOrdersPage } from '@/features/orders/pages/MyOrdersPage'
import { OrderConfirmationPage } from '@/features/orders/pages/OrderConfirmationPage'
import { OrderDetailPage } from '@/features/orders/pages/OrderDetailPage'
import { HomePage } from '@/features/storefront/pages/HomePage'
import { WatchDetailPage } from '@/features/storefront/pages/WatchDetailPage'
import { WatchListingPage } from '@/features/storefront/pages/WatchListingPage'

const AppLayout = () => {
  const { isAuthenticated } = useAuth()
  const { cart, wishlist } = useCommerce()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const cartCount = cart?.items?.reduce((total, item) => total + Number(item.quantity || 1), 0) || 0

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-950">
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

      <div className="mx-auto min-h-screen w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="pb-14">

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/watches" element={<WatchListingPage />} />
          <Route path="/watches/:slug" element={<WatchDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/orders/confirmation/:id" element={<OrderConfirmationPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
          </Route>
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverviewPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="catalog" element={<AdminCatalogPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="orders/:id" element={<AdminOrderDetailPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </div>
        <footer className="mt-10 grid gap-6 border-t border-slate-200 py-8 text-sm text-slate-500 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="mb-2 text-lg font-black text-slate-950">Thilani Watch Web</p>
            <p className="max-w-md leading-6">Curated luxury watches, elegant shopping tools, and a refined buying experience from browse to checkout.</p>
          </div>
          <div>
            <p className="mb-3 font-black uppercase tracking-[0.18em] text-slate-950">Explore</p>
            <div className="grid gap-2">
              <Link className="text-slate-500 no-underline hover:text-[#8f6f10]" to="/watches">All watches</Link>
              <Link className="text-slate-500 no-underline hover:text-[#8f6f10]" to="/cart">Cart</Link>
              <Link className="text-slate-500 no-underline hover:text-[#8f6f10]" to="/wishlist">Wishlist</Link>
            </div>
          </div>
          <div>
            <p className="mb-3 font-black uppercase tracking-[0.18em] text-slate-950">Service</p>
            <p className="leading-6">Premium presentation, secure account access, and order tracking for every collection.</p>
          </div>
        </footer>
      </div>
    </div>
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

const App = () => (
  <AuthProvider>
    <CommerceProvider>
      <AppLayout />
    </CommerceProvider>
  </AuthProvider>
)

export default App
