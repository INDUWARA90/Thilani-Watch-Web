import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from '@/features/auth/providers/AuthContext'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { CommerceProvider } from '@/features/commerce/providers/CommerceProvider'
import { AdminLayout, RequireAdmin } from '@/features/admin/layout/AdminLayout'
import { AppLayout } from '@/app/layout/AppLayout'
import { LoadingState } from '@/shared/ui/LoadingState'

const lazyPage = (loader, exportName = 'default') =>
  lazy(() => loader().then((module) => ({ default: module[exportName] })))

const HomePage = lazyPage(() => import('@/features/storefront/pages/HomePage'), 'HomePage')
const WatchListingPage = lazyPage(() => import('@/features/storefront/pages/WatchListingPage'), 'WatchListingPage')
const WatchDetailPage = lazyPage(() => import('@/features/storefront/pages/WatchDetailPage'), 'WatchDetailPage')
const AboutPage = lazyPage(() => import('@/features/public/pages/AboutPage'))
const ContactPage = lazyPage(() => import('@/features/public/pages/ContactPage'))
const FaqPage = lazyPage(() => import('@/features/public/pages/FaqPage'))
const PolicyPage = lazyPage(() => import('@/features/public/pages/PolicyPage'))

const LoginPage = lazyPage(() => import('@/features/auth/pages/LoginPage'), 'LoginPage')
const RegisterPage = lazyPage(() => import('@/features/auth/pages/RegisterPage'), 'RegisterPage')
const DashboardPage = lazyPage(() => import('@/features/auth/pages/DashboardPage'), 'DashboardPage')
const ProfilePage = lazyPage(() => import('@/features/auth/pages/ProfilePage'), 'ProfilePage')

const CartPage = lazyPage(() => import('@/features/commerce/pages/CartPage'), 'CartPage')
const WishlistPage = lazyPage(() => import('@/features/commerce/pages/WishlistPage'), 'WishlistPage')

const CheckoutPage = lazyPage(() => import('@/features/orders/pages/CheckoutPage'), 'CheckoutPage')
const MyOrdersPage = lazyPage(() => import('@/features/orders/pages/MyOrdersPage'), 'MyOrdersPage')
const OrderConfirmationPage = lazyPage(() => import('@/features/orders/pages/OrderConfirmationPage'), 'OrderConfirmationPage')
const OrderDetailPage = lazyPage(() => import('@/features/orders/pages/OrderDetailPage'), 'OrderDetailPage')

const AdminOverviewPage = lazyPage(() => import('@/features/admin/pages/AdminOverviewPage'), 'AdminOverviewPage')
const AdminProductsPage = lazyPage(() => import('@/features/admin/pages/AdminProductsPage'), 'AdminProductsPage')
const AdminCatalogPage = lazyPage(() => import('@/features/admin/pages/AdminCatalogPage'), 'AdminCatalogPage')
const AdminOrdersPage = lazyPage(() => import('@/features/admin/pages/AdminOrdersPage'), 'AdminOrdersPage')
const AdminOrderDetailPage = lazyPage(() => import('@/features/admin/pages/AdminOrdersPage'), 'AdminOrderDetailPage')
const AdminReviewsPage = lazyPage(() => import('@/features/admin/pages/AdminReviewsPage'), 'AdminReviewsPage')
const AdminMessagesPage = lazyPage(() => import('@/features/admin/pages/AdminMessagesPage'), 'AdminMessagesPage')
const AdminCouponsPage = lazyPage(() => import('@/features/admin/pages/AdminCouponsPage'), 'AdminCouponsPage')
const AdminCustomersPage = lazyPage(() => import('@/features/admin/pages/AdminCustomersPage'), 'AdminCustomersPage')

const AppRoutes = () => (
  <Suspense fallback={<LoadingState label="Loading page" />}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/policy" element={<PolicyPage />} />
      <Route path="/faq" element={<FaqPage />} />
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
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="catalog" element={<AdminCatalogPage />} />
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
  </Suspense>
)

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
