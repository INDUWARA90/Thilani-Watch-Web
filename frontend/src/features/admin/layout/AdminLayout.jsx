import { useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router'
import { ArrowUpRight, BarChart3, Boxes, ClipboardList, Home, LayoutDashboard, Menu, MessageSquareText, ShieldAlert, Tags, TicketPercent, Users, X } from 'lucide-react'
import { LoadingState } from '@/shared/ui/LoadingState'
import { useAuth } from '@/features/auth/hooks/useAuth'

const adminLinks = [
  { to: '/admin', label: 'Overview', end: true, icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Boxes },
  { to: '/admin/catalog', label: 'Categories & Brands', icon: Tags },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/reviews', label: 'Reviews', icon: MessageSquareText },
  { to: '/admin/coupons', label: 'Coupons', icon: TicketPercent },
  { to: '/admin/customers', label: 'Customers', icon: Users },
]

export const RequireAdmin = () => {
  const { isAdmin, isAuthenticated, isRestoring } = useAuth()
  const location = useLocation()

  if (isRestoring) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoadingState label="Verifying security credentials..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen w-full bg-slate-50 grid place-items-center p-4">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-100 animate-in zoom-in-95 duration-200">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 border border-rose-100 text-rose-600">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-rose-600">Access Denied</p>
          <h1 className="mb-3 text-2xl font-black tracking-tight text-slate-900">Admin Area Required</h1>
          <p className="mb-6 text-sm text-slate-500 leading-relaxed">
            Your current account credentials do not possess the structural permissions to modify administrative store data.
          </p>
          <div className="flex flex-col gap-2">
            <Link 
              className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-xs font-bold text-white transition hover:bg-slate-800" 
              to="/dashboard"
            >
              Back to Dashboard
            </Link>
            <Link 
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900" 
              to="/"
            >
              Return Home
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return <Outlet />
}

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <section className="grid min-h-screen bg-slate-50/50 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="hidden border-r border-slate-900 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/40 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between">
        <AdminSidebarContent />
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <button
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm"
            type="button"
            aria-label="Open admin navigation"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-700">Control Hub</p>
            <h1 className="text-base font-extrabold text-slate-950">Store Engine</h1>
          </div>
        </header>

        <main className="p-5 sm:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin navigation">
          <button
            className="absolute inset-0 cursor-default bg-slate-950/60 backdrop-blur-sm"
            type="button"
            aria-label="Close admin navigation"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="relative flex h-full w-[min(82vw,320px)] flex-col overflow-y-auto bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/50">
            <div className="mb-5 flex justify-end">
              <button
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-white/10 bg-white/5 text-white"
                type="button"
                aria-label="Close admin navigation"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <AdminSidebarContent onNavigate={() => setIsSidebarOpen(false)} />
          </aside>
        </div>
      )}
    </section>
  )
}

const AdminSidebarContent = ({ onNavigate }) => (
  <div className="flex flex-col gap-8">
    <div className="flex items-center gap-3.5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal-500 text-slate-950 shadow-md shadow-teal-500/10">
        <BarChart3 className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-teal-400">Control Hub</p>
        <h1 className="mt-1 text-xl font-extrabold leading-none tracking-tight text-white">Store Engine</h1>
      </div>
    </div>

    <Link 
      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-xs font-bold text-slate-300 no-underline transition-all hover:bg-white/10 hover:text-white" 
      to="/"
      onClick={onNavigate}
    >
      <span className="inline-flex items-center gap-2.5">
        <Home className="h-4 w-4 text-teal-400" />
        Go to website
      </span>
      <ArrowUpRight className="h-4 w-4 text-slate-500" />
    </Link>

    <div className="flex flex-col gap-2">
      <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Management</p>
      <nav className="grid gap-1" aria-label="Admin navigation">
        {adminLinks.map((link) => {
          const Icon = link.icon

          return (
            <NavLink
              className={({ isActive }) =>
                [
                  'group relative inline-flex items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-bold text-slate-400 no-underline transition-all duration-200 hover:bg-white/5 hover:text-slate-100',
                  isActive && 'bg-white/10 text-white font-extrabold shadow-sm',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
              end={link.end}
              key={link.to}
              to={link.to}
              onClick={onNavigate}
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute left-0 top-3 h-4 w-1 rounded-r-full bg-teal-400" />}
                  <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  {link.label}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>
    </div>
  </div>
)
