import { Link, Navigate, Route, Routes } from 'react-router'
import { AdminCatalogPage } from './features/admin/AdminCatalogPage'
import { AdminLayout, RequireAdmin } from './features/admin/AdminLayout'
import { AdminOrderDetailPage, AdminOrdersPage } from './features/admin/AdminOrdersPage'
import { AdminOverviewPage } from './features/admin/AdminOverviewPage'
import { AdminProductsPage } from './features/admin/AdminProductsPage'
import { AdminReviewsPage } from './features/admin/AdminReviewsPage'
import { AuthProvider } from './features/auth/AuthContext'
import { DashboardPage } from './features/auth/DashboardPage'
import { LoginPage } from './features/auth/LoginPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { RequireAuth } from './features/auth/RequireAuth'
import { useAuth } from './features/auth/useAuth'
import { CartPage } from './features/commerce/CartPage'
import { CommerceProvider } from './features/commerce/CommerceProvider'
import { WishlistPage } from './features/commerce/WishlistPage'
import { CheckoutPage } from './features/orders/CheckoutPage'
import { MyOrdersPage } from './features/orders/MyOrdersPage'
import { OrderConfirmationPage } from './features/orders/OrderConfirmationPage'
import { OrderDetailPage } from './features/orders/OrderDetailPage'
import { HomePage } from './features/storefront/HomePage'
import { WatchDetailPage } from './features/storefront/WatchDetailPage'
import { WatchListingPage } from './features/storefront/WatchListingPage'

const AppLayout = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 font-sans text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto min-h-screen w-full max-w-[1180px] pb-14">
        <header className="mb-6 flex flex-col gap-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <Link className="text-lg font-bold text-slate-950 no-underline hover:underline" to="/">
            Thilani Watch Web
          </Link>
          <nav className="flex flex-wrap items-center gap-3">
            <Link className="font-bold text-teal-700 no-underline hover:underline" to="/">
              Store
            </Link>
            <Link className="font-bold text-teal-700 no-underline hover:underline" to="/watches">
              Watches
            </Link>
            {isAuthenticated ? (
              <>
                <Link className="font-bold text-teal-700 no-underline hover:underline" to="/cart">
                  Cart
                </Link>
                <Link className="font-bold text-teal-700 no-underline hover:underline" to="/wishlist">
                  Wishlist
                </Link>
                <Link className="font-bold text-teal-700 no-underline hover:underline" to="/orders">
                  Orders
                </Link>
                <Link className="font-bold text-teal-700 no-underline hover:underline" to="/dashboard">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link className="font-bold text-teal-700 no-underline hover:underline" to="/login">
                  Login
                </Link>
                <Link className="font-bold text-teal-700 no-underline hover:underline" to="/register">
                  Register
                </Link>
              </>
            )}
          </nav>
        </header>

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
    </div>
  )
}

const App = () => (
  <AuthProvider>
    <CommerceProvider>
      <AppLayout />
    </CommerceProvider>
  </AuthProvider>
)

export default App
