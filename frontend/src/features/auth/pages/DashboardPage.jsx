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
    <section className="mx-auto w-full max-w-[1200px] rounded-lg border border-white/12 bg-surface p-6 text-white shadow-glowSm sm:p-10">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4 sm:items-center sm:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white text-lg font-bold text-black shadow-lg sm:h-16 sm:w-16 sm:text-xl">
            {initials}
          </div>

          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/75">
                {isAdmin ? <ShieldCheck className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                {accountLabel}
              </span>
            </div>
            <h1 className="max-w-full break-words font-heading text-2xl font-bold tracking-tight text-white sm:text-4xl">
              Welcome back, {displayName}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
              {accountDescription}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:border-red-400/35 hover:bg-red-500/10 hover:text-red-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <LogOut className="h-4 w-4 text-white/65 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:text-red-200" />
          <span>Log Out</span>
        </button>
      </div>

      <div className="mb-8 grid gap-5 rounded-lg border border-white/12 bg-black/25 p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-black">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold uppercase text-white/75">Profile overview</p>
            <h2 className="break-words font-heading text-xl font-bold text-white">{displayName}</h2>
            <div className="mt-3 grid gap-2 text-sm text-white/70 sm:grid-cols-2">
              <span className="inline-flex min-w-0 items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-white/70" />
                <span className="truncate">{user?.email || 'Email not added'}</span>
              </span>
              <span className="inline-flex min-w-0 items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-white/70" />
                <span className="truncate">{user?.phone || 'Phone not added'}</span>
              </span>
            </div>
          </div>
        </div>

        <Link
          to="/profile"
          className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-black no-underline transition hover:shadow-glowSm active:scale-95"
        >
          <Edit3 className="h-4 w-4" />
          Edit profile
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-lg border border-white/12 bg-black/25 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-glowSm"
          >
            <div className="absolute left-0 top-0 h-px w-full bg-white/70 opacity-0 shadow-glow transition-opacity duration-300 group-hover:opacity-100" />

            <div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="min-w-0 break-words font-heading text-lg font-bold leading-snug text-white">
                  {item.title}
                </h2>
                <div className="shrink-0 rounded-full bg-white/10 p-2 text-white/65 transition group-hover:bg-white group-hover:text-black">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-4">
              <Link
                to={item.to}
                className="inline-flex items-center gap-1 text-sm font-bold text-white/70 transition after:absolute after:inset-0 hover:text-white"
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
