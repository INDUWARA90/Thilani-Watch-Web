import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router'
import { BarChart3, Boxes, ClipboardList, LayoutDashboard, MessageSquareText, Tags } from 'lucide-react'
import { useAuth } from '../auth/useAuth'

const adminLinks = [
  { to: '/admin', label: 'Overview', end: true, icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Boxes },
  { to: '/admin/catalog', label: 'Categories & Brands', icon: Tags },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/reviews', label: 'Reviews', icon: MessageSquareText },
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
    <aside className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)] lg:sticky lg:top-24">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#D4AF37] text-slate-950">
          <BarChart3 className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37]">Admin</p>
          <h1 className="text-2xl font-black leading-tight">Store Control</h1>
        </div>
      </div>
      <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1" aria-label="Admin navigation">
        {adminLinks.map((link) => {
          const Icon = link.icon

          return (
          <NavLink
            className={({ isActive }) =>
              [
                'inline-flex items-center gap-3 rounded-lg px-3 py-2.5 font-bold text-slate-300 no-underline transition hover:bg-white/10 hover:text-white',
                isActive && 'bg-white text-slate-950 hover:bg-white hover:text-slate-950',
              ]
                .filter(Boolean)
                .join(' ')
            }
            end={link.end}
            key={link.to}
            to={link.to}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </NavLink>
          )
        })}
      </nav>
    </aside>

    <div className="min-w-0">
      <Outlet />
    </div>
  </section>
)
