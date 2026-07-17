import { ArrowRight, PlayCircle } from 'lucide-react'
import { Link } from 'react-router'
import { heroStats } from '@/features/storefront/lib/homeContent'

export const HomeHero = () => (
  <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F49006_0%,#EB960E_100%)] px-4 pb-28 pt-16 text-white sm:px-6 sm:pt-20 lg:px-10">
    <div className="relative z-10 mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
      <div className="max-w-3xl">
        <p className="mb-4 inline-flex min-h-9 items-center rounded-full border border-white/30 bg-white/10 px-4 text-xs font-medium uppercase tracking-wide text-white backdrop-blur-sm">
          Thilani Watch Web
        </p>
        <h1 className="text-[42px] font-black leading-[1.08] tracking-tight text-white sm:text-[58px] lg:text-[72px]">
          Find a watch that fits your day.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
          Browse curated luxury, everyday, smart, and gift-ready watches with a clean shopping flow from wishlist to checkout.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] bg-[#121212] px-7 text-sm font-semibold text-white no-underline transition hover:bg-[#272222]"
            to="/watches"
          >
            Shop watches <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] border border-white/35 bg-white/10 px-7 text-sm font-semibold text-white no-underline backdrop-blur-sm transition hover:bg-white hover:text-[#121212]"
            to="/watches?featured=true"
          >
            <PlayCircle className="h-4 w-4" /> View featured
          </Link>
        </div>
        <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
          {heroStats.map((stat) => (
            <div className="rounded-[14px] border border-white/25 bg-white/10 p-4 backdrop-blur-sm" key={stat.label}>
              <strong className="block text-2xl font-black text-white">{stat.value}</strong>
              <span className="mt-1 block text-xs font-medium text-white/75">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden rounded-[20px] border border-white/25 bg-white/15 p-6 text-white backdrop-blur-sm lg:block">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/75">Premium picks</p>
        <p className="mt-3 text-3xl font-black leading-tight text-white">New arrivals, best sellers, and trusted brands in one place.</p>
        <p className="mt-4 text-sm leading-7 text-white/75">
          Guide customers quickly into the collection without adding extra visual clutter.
        </p>
      </div>
    </div>
    <svg className="absolute bottom-[-1px] left-0 h-20 w-full text-white" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d="M0 70L60 62.7C120 55 240 41 360 49.3C480 58 600 88 720 92.7C840 98 960 77 1080 63.3C1200 50 1320 44 1380 41.3L1440 39V120H0V70Z" />
    </svg>
  </section>
)
