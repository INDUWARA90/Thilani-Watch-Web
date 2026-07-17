import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { experienceCards } from '@/features/storefront/lib/homeContent'

export const HomeCtaSection = () => (
  <section className="mx-auto max-w-[1200px] px-4 py-10 pb-16 sm:px-6 lg:px-10">
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-[20px] bg-[#121212] p-6 text-white sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#F49006]">Ready to shop</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-5xl">
          Start with the full collection and narrow it down your way.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
          Filters, wishlist, cart, checkout, and order pages are already connected, so the home page can guide customers into the working store flow.
        </p>
        <Link
          className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] bg-[#F49006] px-7 text-sm font-semibold text-white no-underline transition hover:bg-[#EB960E]"
          to="/watches"
        >
          Browse collection <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4">
        {experienceCards.map(({ icon: Icon, title, text }) => (
          <article className="rounded-[18px] border border-[#DEE2E6] bg-white p-5 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.04)]" key={title}>
            <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#F49006]/10 text-[#F49006]">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 text-lg font-black text-[#121212]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6C757D]">{text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
)
