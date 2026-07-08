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
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] sm:p-8">
      <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#8f6f10]">{isAdmin ? 'Admin dashboard' : 'Customer dashboard'}</p>
          <h1 className="mb-4 text-4xl font-black leading-tight text-slate-950">Welcome, {user?.name || 'User'}</h1>
          <p className="mb-7 text-lg text-slate-600">
            {isAdmin
              ? 'Manage the store, products, orders, and catalog setup from here.'
              : 'Access the shopping tools and account areas you need most.'}
          </p>
        </div>
        <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 font-extrabold text-slate-950 transition hover:border-[#D4AF37] hover:text-[#8f6f10] disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {dashboardItems.map((item) => (
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-5 transition hover:border-[#D4AF37] hover:bg-white hover:shadow-lg hover:shadow-slate-950/5" key={item.title}>
            <h2 className="mb-2.5 text-xl font-black">{item.title}</h2>
            <p className="mb-3 text-slate-600">{item.description}</p>
            {item.to && <Link className="font-bold text-[#8f6f10] no-underline hover:underline" to={item.to}>Open</Link>}
          </article>
        ))}
      </div>
    </section>
  )
}
