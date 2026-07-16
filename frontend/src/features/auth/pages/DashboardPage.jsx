import { Link, useNavigate } from 'react-router'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'

const adminItems = [
  {
    title: 'Product Management',
    description: 'Create, edit, publish, and manage watch inventory.',
    to: '/admin/products',
  },
  {
    title: 'Orders',
    description: 'Review customer orders, update statuses, and track payments.',
    to: '/admin/orders',
  },
  {
    title: 'Catalog Setup',
    description: 'Manage brands, categories, and store structure.',
    to: '/admin/catalog',
  },
]

const customerItems = [
  {
    title: 'My Orders',
    description: 'Track orders, view details, and manage cancellations when available.',
    to: '/orders',
  },
  {
    title: 'Wishlist',
    description: 'Keep favorite watches ready for later.',
    to: '/wishlist',
  },
  {
    title: 'Profile',
    description: 'Manage your contact details and saved addresses.',
    to: '/profile',
  },
]

export const DashboardPage = () => {
  const { isAdmin, logout, user } = useAuth()
  const navigate = useNavigate()
  const dashboardItems = isAdmin ? adminItems : customerItems

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <section className="border border-[#DEE2E6] bg-white p-6 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)] sm:p-8">
      <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-normal text-[#F49006]">{isAdmin ? 'Admin dashboard' : 'Customer dashboard'}</p>
          <h1 className="mb-4 text-[44px] font-extrabold leading-tight text-[#121212]">Welcome, {user?.name || 'User'}</h1>
          <p className="mb-7 text-base leading-7 text-[#212529]">
            {isAdmin
              ? 'Manage the store, products, orders, and catalog setup from here.'
              : 'Access the shopping tools and account areas you need most.'}
          </p>
        </div>
        <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-[#DEE2E6] bg-[rgba(18,18,18,0.04)] px-8 text-sm font-normal text-[#121212] transition hover:bg-[rgba(18,18,18,0.08)] disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {dashboardItems.map((item) => (
          <article className="rounded-[20px] border border-[#DEE2E6] bg-[#F8F9FA] p-5 transition hover:bg-white hover:shadow-[16px_18px_16px_0_rgba(0,0,0,0.1)]" key={item.title}>
            <h2 className="mb-2.5 text-xl font-bold text-[#121212]">{item.title}</h2>
            <p className="mb-3 text-[#212529]">{item.description}</p>
            {item.to && <Link className="font-bold text-[#F49006] no-underline hover:text-[#121212]" to={item.to}>Open</Link>}
          </article>
        ))}
      </div>
    </section>
  )
}
