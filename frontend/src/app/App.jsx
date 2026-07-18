import { Navigate, Route, Routes } from 'react-router'
import { AdminCatalogPage } from '@/features/admin/pages/AdminCatalogPage'
import { AdminCouponsPage } from '@/features/admin/pages/AdminCouponsPage'
import { AdminCustomersPage } from '@/features/admin/pages/AdminCustomersPage'
import { AdminLayout, RequireAdmin } from '@/features/admin/layout/AdminLayout'
import { AdminOrderDetailPage, AdminOrdersPage } from '@/features/admin/pages/AdminOrdersPage'
import { AdminOverviewPage } from '@/features/admin/pages/AdminOverviewPage'
import { AdminProductsPage } from '@/features/admin/pages/AdminProductsPage'
import { AdminReviewsPage } from '@/features/admin/pages/AdminReviewsPage'
import { AuthProvider } from '@/features/auth/providers/AuthContext'
import { DashboardPage } from '@/features/auth/pages/DashboardPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { ProfilePage } from '@/features/auth/pages/ProfilePage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { CartPage } from '@/features/commerce/pages/CartPage'
import { CommerceProvider } from '@/features/commerce/providers/CommerceProvider'
import { WishlistPage } from '@/features/commerce/pages/WishlistPage'
import { CheckoutPage } from '@/features/orders/pages/CheckoutPage'
import { MyOrdersPage } from '@/features/orders/pages/MyOrdersPage'
import { OrderConfirmationPage } from '@/features/orders/pages/OrderConfirmationPage'
import { OrderDetailPage } from '@/features/orders/pages/OrderDetailPage'
import { AppLayout } from '@/app/layout/AppLayout'
import AboutPage from '@/features/public/pages/AboutPage'
import ContactPage from '@/features/public/pages/ContactPage'
import FaqPage from '@/features/public/pages/FaqPage'
import PolicyPage from '@/features/public/pages/PolicyPage'
import { HomePage } from '@/features/storefront/pages/HomePage'
import { WatchDetailPage } from '@/features/storefront/pages/WatchDetailPage'
import { WatchListingPage } from '@/features/storefront/pages/WatchListingPage'

const AppRoutes = () => (
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
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="coupons" element={<AdminCouponsPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
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
