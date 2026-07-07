import { Link, useNavigate } from 'react-router'
import { useAuth } from './useAuth'

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
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(28,41,56,0.08)] sm:p-8">
      <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-teal-700">{isAdmin ? 'Admin dashboard' : 'Customer dashboard'}</p>
          <h1 className="mb-4 text-4xl font-bold leading-tight text-slate-950">Welcome, {user?.name || 'User'}</h1>
          <p className="mb-7 text-lg text-slate-600">
            {isAdmin
              ? 'Manage the store, products, orders, and catalog setup from here.'
              : 'Access the shopping tools and account areas you need most.'}
          </p>
        </div>
        <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 font-extrabold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {dashboardItems.map((item) => (
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-5" key={item.title}>
            <h2 className="mb-2.5 text-xl font-bold">{item.title}</h2>
            <p className="mb-3 text-slate-600">{item.description}</p>
            {item.to && <Link className="font-bold text-teal-700 no-underline hover:underline" to={item.to}>Open</Link>}
          </article>
        ))}
      </div>
    </section>
  )
}
