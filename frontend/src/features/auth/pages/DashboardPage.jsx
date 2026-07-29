import { Link, useNavigate } from 'react-router'
import { ArrowUpRight, Edit3, LogOut, Mail, Phone, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePageTitle } from '@/shared/hooks/usePageTitle'

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

const DashboardPage = () => {
  const { isAdmin, logout, user } = useAuth()
  usePageTitle(isAdmin ? 'Admin Dashboard | Thilani Watch Web' : 'Dashboard | Thilani Watch Web')

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
    <main className="min-h-screen bg-base pb-24 text-black">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-100/80 via-base to-base px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-10 border-b border-black/5">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[700px] rounded-full bg-gradient-to-tr from-amber-200/20 via-orange-100/10 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px] min-w-0">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-5 sm:items-center sm:gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black text-lg font-extrabold text-white shadow-xl sm:h-20 sm:w-20 sm:text-2xl font-mono">
                {initials}
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-black shadow-sm backdrop-blur-md">
                    {isAdmin ? <ShieldCheck className="h-3.5 w-3.5 text-amber-600" /> : <User className="h-3.5 w-3.5 text-amber-600" />}
                    {accountLabel}
                  </span>
                </div>
                <h1 className="max-w-full break-words font-heading text-[34px] font-extrabold tracking-tight leading-[1.05] text-black sm:text-[46px] lg:text-[54px]">
                  Welcome back, {displayName}
                </h1>
                <p className="mt-2 max-w-2xl text-sm font-normal leading-relaxed text-stone-600 sm:text-black">
                  {accountDescription}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              type="button"
              className="group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-red-500/20 bg-red-500/5 px-6 py-3 text-sm font-bold text-red-600 shadow-sm transition-all duration-200 hover:bg-red-500 hover:text-white active:scale-95 cursor-pointer"
            >
              <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <section className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-6 lg:px-10">
        {/* Profile Overview Card */}
        <div className="mb-10 flex flex-col gap-6 rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4 sm:gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-sm font-bold text-black font-mono shadow-inner">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-stone-500">Profile Overview</p>
              <h2 className="break-words font-heading text-xl font-bold tracking-tight text-black">{displayName}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-stone-600">
                <span className="inline-flex min-w-0 items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-stone-400" />
                  <span className="truncate">{user?.email || 'Email not added'}</span>
                </span>
                <span className="inline-flex min-w-0 items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-stone-400" />
                  <span className="truncate">{user?.phone || 'Phone not added'}</span>
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/profile"
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-bold text-white no-underline shadow-md transition-all hover:bg-stone-800 active:scale-98"
          >
            <Edit3 className="h-4 w-4" />
            Edit profile
          </Link>
        </div>

        {/* Action Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-black/25 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h2 className="min-w-0 break-words font-heading text-xl font-bold tracking-tight text-black leading-snug">
                    {item.title}
                  </h2>
                  <div className="shrink-0 rounded-2xl bg-stone-100 p-3 text-stone-700 transition-all duration-300 group-hover:bg-black group-hover:text-white shadow-inner">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-black/5">
                <Link
                  to={item.to}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-black transition-colors hover:text-amber-600 after:absolute after:inset-0"
                >
                  Explore section
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default DashboardPage

const getInitials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
