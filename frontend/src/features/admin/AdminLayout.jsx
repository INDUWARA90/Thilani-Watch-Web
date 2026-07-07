import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../auth/useAuth'

const adminLinks = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/catalog', label: 'Categories & Brands' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/reviews', label: 'Reviews' },
]

export const RequireAdmin = () => {
  const { isAdmin, isAuthenticated, isRestoring } = useAuth()
  const location = useLocation()

  if (isRestoring) {
    return <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 font-bold text-emerald-950">Checking admin access...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!isAdmin) {
    // Show a clear 403-style state instead of hiding the reason with a redirect.
    return (
      <section className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-900">
        <p className="mb-3 text-sm font-extrabold uppercase tracking-normal">Access denied</p>
        <h1 className="mb-3 text-3xl font-bold leading-tight">Admin access required</h1>
        <p className="mb-5 font-bold">Your account does not have permission to open this admin area.</p>
        <Link className="font-extrabold text-red-950 underline" to="/dashboard">
          Back to dashboard
        </Link>
      </section>
    )
  }

  return <Outlet />
}

export const AdminLayout = () => (
  <section className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
    <aside className="rounded-lg border border-slate-200 bg-white p-6 lg:sticky lg:top-5">
      <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-teal-700">Admin</p>
      <h1 className="mb-5 text-3xl font-bold leading-tight text-slate-950">Store Control</h1>
      <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1" aria-label="Admin navigation">
        {adminLinks.map((link) => (
          <NavLink
            className={({ isActive }) =>
              [
                'rounded-lg px-3 py-2.5 font-bold text-slate-700 no-underline hover:bg-teal-50 hover:text-teal-700',
                isActive && 'bg-teal-50 text-teal-700',
              ]
                .filter(Boolean)
                .join(' ')
            }
            end={link.end}
            key={link.to}
            to={link.to}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>

    <div className="min-w-0">
      <Outlet />
    </div>
  </section>
)
