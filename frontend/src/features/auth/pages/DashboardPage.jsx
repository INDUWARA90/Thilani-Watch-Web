import React from 'react'
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
    title: 'Category Setup',
    description: 'Manage category records, slugs, sorting, images, and visibility.',
    to: '/admin/catalog',
  },
  {
    title: 'Brand Management',
    description: 'Manage brand records, slugs, sorting, images, and visibility.',
    to: '/admin/brands',
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
      <div className="mx-auto max-w-[1200px] px-4 pt-8 sm:px-6 lg:px-10">
        
        {/* Workspace Executive Split Header */}
        <section className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-stretch">
          
          {/* Main User Identity Box */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-b from-stone-100/80 via-base to-base p-6 sm:p-8 shadow-sm lg:col-span-7">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-black shadow-sm backdrop-blur-md">
                  {isAdmin ? <ShieldCheck className="h-4 w-4 text-amber-600" /> : <User className="h-4 w-4 text-amber-600" />}
                  {accountLabel}
                </span>

                <button
                  onClick={handleLogout}
                  type="button"
                  className="group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-bold text-red-600 shadow-sm transition-all duration-200 hover:bg-red-500 hover:text-white active:scale-95 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                  <span>Log out</span>
                </button>
              </div>

              <div className="mt-8 flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black text-2xl font-extrabold text-white shadow-xl font-mono">
                  {initials}
                </div>
                <div className="min-w-0">
                  <h1 className="max-w-full break-words font-heading text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
                    Welcome back, {displayName}
                  </h1>
                  <p className="mt-1.5 text-sm font-normal leading-relaxed text-stone-600 sm:text-base">
                    {accountDescription}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-black/5 pt-4">
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:text-amber-600"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile Details
              </Link>
            </div>
          </div>

          {/* Quick Profile Summary Panel */}
          <div className="flex flex-col justify-between rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] lg:col-span-5">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">Account Contact Overview</p>
              <h2 className="break-words font-heading text-xl font-bold tracking-tight text-black">{displayName}</h2>
              
              <div className="mt-6 grid gap-3 text-base text-stone-600">
                <div className="flex items-center gap-3 rounded-2xl bg-stone-50 p-3.5 border border-black/5">
                  <Mail className="h-4.5 w-4.5 shrink-0 text-stone-400" />
                  <span className="truncate text-sm font-medium text-black">{user?.email || 'Email not added'}</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-stone-50 p-3.5 border border-black/5">
                  <Phone className="h-4.5 w-4.5 shrink-0 text-stone-400" />
                  <span className="truncate text-sm font-medium text-black">{user?.phone || 'Phone not added'}</span>
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs text-stone-400">
              Need assistance? Access settings from your profile hub.
            </p>
          </div>
        </section>

        {/* Dynamic Navigational Grid */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-black">
              Workspace Actions
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {items.map((item, idx) => (
              <article
                key={item.title}
                className="group relative flex min-w-0 flex-col justify-between rounded-3xl border border-black/10 bg-white p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-black/25 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="mt-1 break-words font-heading text-xl font-bold tracking-tight text-black">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      {item.description}
                    </p>
                  </div>

                  <div className="shrink-0 rounded-2xl bg-stone-100 p-3.5 text-stone-700 transition-all duration-300 group-hover:bg-black group-hover:text-white shadow-inner">
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-black/5">
                  <Link
                    to={item.to}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-black transition-colors hover:text-amber-600 after:absolute after:inset-0"
                  >
                    Explore section
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

      </div>
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