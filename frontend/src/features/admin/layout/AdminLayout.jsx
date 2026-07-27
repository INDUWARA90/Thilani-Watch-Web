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
  { to: '/admin/messages', label: 'Messages', icon: MessageSquareText },
  { to: '/admin/reviews', label: 'Reviews', icon: MessageSquareText },
  { to: '/admin/coupons', label: 'Coupons', icon: TicketPercent },
  { to: '/admin/customers', label: 'Customers', icon: Users },
]

export const RequireAdmin = () => {
  const { isAdmin, isAuthenticated, isRestoring } = useAuth()
  const location = useLocation()

  if (isRestoring) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base text-white">
        <LoadingState label="Verifying security credentials..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen w-full place-items-center bg-base p-4 text-white">
        <section className="w-full max-w-md animate-in rounded-lg border border-white/12 bg-surface p-8 text-center shadow-glowSm zoom-in-95 duration-200">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-red-400/30 bg-red-500/10 text-red-200">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <p className="mb-2 text-xs font-bold uppercase text-red-200">Access Denied</p>
          <h1 className="mb-3 font-heading text-2xl font-bold tracking-tight text-white">Admin Area Required</h1>
          <p className="mb-6 text-sm leading-relaxed text-white/70">
            Your current account credentials do not possess the structural permissions to modify administrative store data.
          </p>
          <div className="flex flex-col gap-2">
            <Link 
              className="inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-xs font-bold text-black transition hover:shadow-glowSm" 
              to="/dashboard"
            >
              Back to Dashboard
            </Link>
            <Link 
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 text-xs font-bold text-white transition hover:border-white/45" 
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
    <section className="admin-theme grid min-h-screen min-w-0 items-stretch overflow-x-hidden bg-base text-white lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="hidden min-h-screen border-r border-[#d6b25e]/20 bg-[linear-gradient(180deg,#050505_0%,#101010_52%,#050505_100%)] p-6 text-white shadow-[0_0_28px_rgba(214,178,94,0.12)] lg:flex lg:flex-col lg:justify-between">
        <AdminSidebarContent />
      </aside>

      <div className="min-w-0 overflow-x-hidden">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-black/70 px-4 py-3 backdrop-blur lg:hidden">
          <button
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-white shadow-sm"
            type="button"
            aria-label="Open admin navigation"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-white/60">Control Hub</p>
            <h1 className="font-heading text-base font-bold text-white">Store Engine</h1>
          </div>
        </header>

        <main className="min-w-0 p-4 sm:p-8 lg:p-10">
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
          <aside className="relative flex h-full w-[min(86vw,320px)] flex-col overflow-y-auto border-r border-[#d6b25e]/20 bg-[linear-gradient(180deg,#050505_0%,#101010_52%,#050505_100%)] p-5 text-white shadow-2xl shadow-black/70 sm:p-6">
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
    <div className="flex min-w-0 items-center gap-3.5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[#d6b25e]/35 bg-[#d6b25e] text-black shadow-[0_0_22px_rgba(214,178,94,0.26)]">
        <BarChart3 className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase text-[#d6b25e]">Control Hub</p>
        <h1 className="mt-1 truncate font-heading text-xl font-bold leading-none tracking-tight text-white">Store Engine</h1>
      </div>
    </div>

    <Link 
      className="flex items-center justify-between rounded-lg border border-[#d6b25e]/20 bg-[#d6b25e]/10 px-4 py-3 text-xs font-bold text-[#f8e7b0] no-underline transition hover:border-[#d6b25e]/40 hover:bg-[#d6b25e]/16 hover:text-white hover:shadow-[0_0_18px_rgba(214,178,94,0.18)]" 
      to="/"
      onClick={onNavigate}
    >
      <span className="inline-flex items-center gap-2.5">
        <Home className="h-4 w-4 text-[#d6b25e]" />
        Go to website
      </span>
      <ArrowUpRight className="h-4 w-4 text-[#d6b25e]/75" />
    </Link>

    <div className="flex flex-col gap-2">
      <p className="px-3 text-[10px] font-bold uppercase text-[#d6b25e]/75">Management</p>
      <nav className="grid gap-1" aria-label="Admin navigation">
        {adminLinks.map((link) => {
          const Icon = link.icon

          return (
            <NavLink
              className={({ isActive }) =>
                [
                  'group relative inline-flex items-center gap-3.5 rounded-lg border border-transparent px-4 py-3 text-xs font-bold text-white/62 no-underline transition duration-200 hover:border-[#d6b25e]/18 hover:bg-[#d6b25e]/10 hover:text-white',
                  isActive && 'border-[#d6b25e]/30 bg-[#d6b25e]/14 text-white font-extrabold shadow-[0_0_20px_rgba(214,178,94,0.18)]',
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
                  {isActive && <span className="absolute left-0 top-3 h-4 w-1 rounded-r-full bg-[#d6b25e] shadow-[0_0_14px_rgba(214,178,94,0.5)]" />}
                  <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-[#d6b25e]' : 'text-white/42 group-hover:text-[#d6b25e]'}`} />
                  <span className="min-w-0 break-words">{link.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>
    </div>
  </div>
)
