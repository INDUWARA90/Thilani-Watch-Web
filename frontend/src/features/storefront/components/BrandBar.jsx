import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { getCatalogImage, getCatalogValue, getId, getTitle } from '@/features/storefront/lib/storefrontUtils'

// Replace with a luxury watch lifestyle placeholder if the logo is missing
const lifestyleFallback = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'

export const BrandBar = ({ brands }) => (
  <section className="my-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    
    {/* Clean Luxury Title Block */}
    <div className="mb-10 flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-end">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600">
          The Curated Index
        </span>
        <h2 className="mt-2 text-3xl font-light tracking-tight text-slate-900">
          Master <span className="font-semibold">Horology Houses</span>
        </h2>
      </div>
      <Link 
        className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-900" 
        to="/watches"
      >
        View Registry
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>

    {/* Immersive Structural Grid */}
    {brands.length > 0 ? (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {brands.slice(0, 8).map((brand) => {
          const brandImage = getCatalogImage(brand)
          
          return (
            <Link 
              className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10" 
              key={getId(brand)} 
              to={`/watches?brand=${encodeURIComponent(getCatalogValue(brand))}`}
            >
              {/* Massive Full-Card Background Image Cover */}
              <img 
                className="absolute inset-0 h-full w-full object-cover opacity-80 transition-all duration-700 ease-out scale-100 group-hover:scale-105 group-hover:opacity-60" 
                src={brandImage || lifestyleFallback} 
                alt={getTitle(brand)} 
              />

              {/* Dynamic Dark Gradient Mask to protect typography readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent transition-opacity duration-500 group-hover:from-slate-950/90" />

              {/* Top Floating Utility Icon Accent */}
              <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/20 p-2 text-white opacity-0 blur-[2px] transition-all duration-300 group-hover:opacity-100 group-hover:blur-0">
                <ArrowUpRight className="h-4 w-4" />
              </div>

              {/* Floating Blurry Glass Card Metadata Panel at bottom */}
              <div className="absolute bottom-4 left-4 right-4 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-colors duration-300 group-hover:bg-white/10">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-400">
                  Collection
                </p>
                <h3 className="mt-0.5 text-base font-semibold tracking-tight text-white">
                  {getTitle(brand)}
                </h3>
                
                {/* Hidden action slider line that appears smoothly on desktop hover */}
                <div className="grid grid-rows-[0fr] transition-all duration-300 group-hover:grid-rows-[1fr]">
                  <p className="overflow-hidden text-[11px] text-slate-300 transition-all opacity-0 duration-300 pt-0 group-hover:opacity-100 group-hover:pt-2">
                    Explore available timepieces &rarr;
                  </p>
                </div>
              </div>

            </Link>
          )
        })}
      </div>
    ) : (
      <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          No Registry Records Found
        </span>
      </div>
    )}
  </section>
)