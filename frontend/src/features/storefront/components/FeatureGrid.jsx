import { ArrowRight, BadgeCheck, Gem, ShieldCheck, Truck } from 'lucide-react'
import { Link } from 'react-router'

export const FeatureGrid = () => (
  <section className="my-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    
    {/* Section Header */}
    <div className="mb-10 border-b border-slate-100 pb-6">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-700">
        Our Commitment
      </span>
      <h2 className="mt-2 text-3xl font-light tracking-tight text-slate-900">
        A Modern <span className="font-semibold">Horology Experience</span>
      </h2>
    </div>

    {/* Features Main Ledger */}
    <div className="grid gap-6 md:grid-cols-3">
      {[
        [ShieldCheck, 'Authentic Details', 'Rigorous, clear product lineage and certified condition monitoring with trusted, transparent watch presentations.'],
        [Truck, 'Seamless Logistics', 'Simplified, secure checkout architecture and optimized order fulfillment paths from discovery straight to your door.'],
        [BadgeCheck, 'Bespoke Experience', 'An elegant digital environment designed exclusively for confident, premium watch procurement.'],
      ].map(([Icon, title, copy]) => (
        <div 
          className="group relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-200 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]" 
          key={title}
        >
          {/* Icon Container with subtle scaling */}
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 transition-colors duration-300 group-hover:bg-slate-950 group-hover:text-white">
            <Icon className="h-4 w-4" />
          </div>
          
          <h3 className="mb-2 text-sm font-bold tracking-tight text-slate-900">
            {title}
          </h3>
          
          <p className="text-xs leading-relaxed text-slate-400">
            {copy}
          </p>
        </div>
      ))}

      {/* Hero Accent CTA Ribbon Card */}
      <div className="rounded-2xl border border-slate-950 bg-slate-950 p-6 text-white shadow-md md:col-span-3">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-400 backdrop-blur-md">
              <Gem className="h-5 w-5" />
            </div>
            <div>
              <strong className="block text-sm font-bold tracking-tight">
                Curated Collections Are Active
              </strong>
              <span className="text-xs text-slate-400">
                Advance below to browse our strictly vetted physical masterpieces.
              </span>
            </div>
          </div>
          
          <Link 
            className="group inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-bold uppercase tracking-wider text-slate-950 no-underline transition-all duration-300 hover:bg-amber-500 hover:text-slate-950" 
            to="/watches?featured=true"
          >
            Browse Vault 
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  </section>
)