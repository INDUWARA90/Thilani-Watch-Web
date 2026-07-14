import { ArrowRight, BadgeCheck, Gem, ShieldCheck, Truck } from 'lucide-react'
import { Link } from 'react-router'

export const FeatureGrid = () => (
  <section className="mx-auto max-w-[1200px] py-16">
    <div className="mb-10 border-b border-[#DEE2E6] pb-6">
      <span className="text-sm font-normal text-[#F49006]">Our commitment</span>
      <h2 className="mt-2 text-[34px] font-bold leading-tight text-[#121212] sm:text-[50px] sm:leading-[48px]">
        A modern horology experience
      </h2>
    </div>

    <div className="grid gap-5 md:grid-cols-3">
      {[
        [ShieldCheck, 'Authentic Details', 'Clear product lineage and trusted, transparent watch presentations.'],
        [Truck, 'Seamless Logistics', 'Simple checkout and optimized fulfillment from discovery to your door.'],
        [BadgeCheck, 'Bespoke Experience', 'A bright digital environment designed for confident premium watch buying.'],
      ].map(([Icon, title, copy]) => (
        <div className="rounded-[20px] border border-[#DEE2E6] bg-white p-6 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)] transition hover:shadow-[16px_18px_16px_0_rgba(0,0,0,0.1)]" key={title}>
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#F49006] text-white">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-[#121212]">{title}</h3>
          <p className="text-sm leading-6 text-[#212529]">{copy}</p>
        </div>
      ))}

      <div className="rounded-[20px] bg-[#121212] p-6 text-white md:col-span-3">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#F49006]">
              <Gem className="h-5 w-5" />
            </div>
            <div>
              <strong className="block text-xl font-bold text-white">Curated collections are active</strong>
              <span className="text-sm text-white/70">Browse the latest featured watches in the storefront.</span>
            </div>
          </div>
          <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] bg-white px-8 text-sm font-normal text-[#121212] no-underline transition hover:text-[#F49006]" to="/watches?featured=true">
            Browse watches
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  </section>
)
