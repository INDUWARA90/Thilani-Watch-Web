import { Link, useNavigate } from 'react-router'
import { ArrowUpRight, Edit3, LogOut, Mail, Phone, ShieldCheck, User } from 'lucide-react'
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
  const items = isAdmin ? adminItems : customerItems
  const displayName = user?.name || 'User'
  const accountLabel = isAdmin ? 'Admin Portal' : 'Customer Account'
  const accountDescription = isAdmin
    ? 'Manage store products, orders, and catalog preferences.'
    : 'Access your shopping activity and personal account settings.'
  const initials = getInitials(displayName)

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <section className="mx-auto w-full max-w-7xl rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/50 p-6 shadow-xl shadow-slate-200/50 sm:p-10">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4 sm:items-center sm:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F49006] to-amber-600 text-lg font-bold text-white shadow-lg shadow-amber-500/20 sm:h-16 sm:w-16 sm:text-xl">
            {initials}
          </div>

          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-[#F49006] ring-1 ring-inset ring-amber-500/20">
                {isAdmin ? <ShieldCheck className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                {accountLabel}
              </span>
            </div>
            <h1 className="max-w-full break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome back, {displayName}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              {accountDescription}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-red-200 hover:bg-red-50/40 hover:text-red-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500/25 whitespace-nowrap"
        >
          <LogOut className="h-4 w-4 text-slate-400 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:text-red-500" />
          <span>Log Out</span>
        </button>
      </div>

      <div className="mb-8 grid gap-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#F49006]">Profile overview</p>
            <h2 className="break-words text-xl font-bold text-slate-950">{displayName}</h2>
            <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              <span className="inline-flex min-w-0 items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate">{user?.email || 'Email not added'}</span>
              </span>
              <span className="inline-flex min-w-0 items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate">{user?.phone || 'Phone not added'}</span>
              </span>
            </div>
          </div>
        </div>

        <Link
          to="/profile"
          className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white no-underline transition hover:bg-[#F49006] active:scale-95"
        >
          <Edit3 className="h-4 w-4" />
          Edit profile
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60"
          >
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#F49006] to-amber-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="min-w-0 break-words text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#F49006]">
                  {item.title}
                </h2>
                <div className="shrink-0 rounded-full bg-slate-100 p-2 text-slate-400 transition-colors group-hover:bg-amber-50 group-hover:text-[#F49006]">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-4">
              <Link
                to={item.to}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#F49006] transition-colors after:absolute after:inset-0 hover:text-amber-600"
              >
                Explore Section
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

const getInitials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
