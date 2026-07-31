import { lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { AuthProvider } from '@/features/auth/providers/AuthContext'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { CommerceProvider } from '@/features/commerce/providers/CommerceProvider'
import { AdminLayout, RequireAdmin } from '@/features/admin/layout/AdminLayout'
import { AppLayout } from '@/app/layout/AppLayout'
import { LoadingState } from '@/shared/ui/LoadingState'
import { RouteErrorBoundary } from '@/shared/ui/RouteErrorBoundary'

const HomePage = lazy(() => import('@/features/storefront/pages/HomePage'))
const WatchListingPage = lazy(() => import('@/features/storefront/pages/WatchListingPage'))
const WatchDetailPage = lazy(() => import('@/features/storefront/pages/WatchDetailPage'))
const AboutPage = lazy(() => import('@/features/public/pages/AboutPage'))
const ContactPage = lazy(() => import('@/features/public/pages/ContactPage'))
const FaqPage = lazy(() => import('@/features/public/pages/FaqPage'))
const PolicyPage = lazy(() => import('@/features/public/pages/PolicyPage'))

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'))
const DashboardPage = lazy(() => import('@/features/auth/pages/DashboardPage'))
const ProfilePage = lazy(() => import('@/features/auth/pages/ProfilePage'))

const CartPage = lazy(() => import('@/features/commerce/pages/CartPage'))
const WishlistPage = lazy(() => import('@/features/commerce/pages/WishlistPage'))

const CheckoutPage = lazy(() => import('@/features/orders/pages/CheckoutPage'))
const MyOrdersPage = lazy(() => import('@/features/orders/pages/MyOrdersPage'))
const OrderConfirmationPage = lazy(() => import('@/features/orders/pages/OrderConfirmationPage'))
const OrderDetailPage = lazy(() => import('@/features/orders/pages/OrderDetailPage'))

const AdminOverviewPage = lazy(() => import('@/features/admin/pages/AdminOverviewPage'))
const AdminProductsPage = lazy(() => import('@/features/admin/pages/AdminProductsPage'))
const AdminCatalogPage = lazy(() => import('@/features/admin/pages/AdminCatalogPage'))
const AdminBrandsPage = lazy(() => import('@/features/admin/pages/AdminBrandsPage'))
const AdminOrdersPage = lazy(() => import('@/features/admin/pages/AdminOrdersPage'))
const AdminOrderDetailPage = lazy(() => import('@/features/admin/pages/AdminOrderDetailPage'))
const AdminReviewsPage = lazy(() => import('@/features/admin/pages/AdminReviewsPage'))
const AdminMessagesPage = lazy(() => import('@/features/admin/pages/AdminMessagesPage'))
const AdminCouponsPage = lazy(() => import('@/features/admin/pages/AdminCouponsPage'))
const AdminCustomersPage = lazy(() => import('@/features/admin/pages/AdminCustomersPage'))

const AppRoutes = () => {
  const location = useLocation()  
  return (
    <RouteErrorBoundary resetKey={location.pathname}>
      <Suspense fallback={<LoadingState label="Loading page" variant="page" />}>
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            initial={{ opacity: 0, y: 14 }}
            key={location.pathname}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/policy" element={<PolicyPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/watches" element={<WatchListingPage />} />
              <Route path="/watches/:slug" element={<WatchDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route element={<RequireAuth />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/orders" element={<MyOrdersPage />} />
                <Route path="/orders/confirmation/:id" element={<OrderConfirmationPage />} />
                <Route path="/orders/:id" element={<OrderDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              <Route element={<RequireAdmin />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminOverviewPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="catalog" element={<AdminCatalogPage />} />
                  <Route path="brands" element={<AdminBrandsPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="orders/:id" element={<AdminOrderDetailPage />} />
                  <Route path="messages" element={<AdminMessagesPage />} />
                  <Route path="reviews" element={<AdminReviewsPage />} />
                  <Route path="coupons" element={<AdminCouponsPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Suspense>
    </RouteErrorBoundary>
  )
}

const App = () => (
  <AuthProvider>
    <CommerceProvider>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </CommerceProvider>
  </AuthProvider>
)

export default App
