import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { getCatalogImage, getCatalogValue, getId, getTitle } from '@/features/storefront/lib/storefrontUtils'

const lifestyleFallback = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'

export const BrandBar = ({ brands }) => (
  <section className="mx-auto max-w-[1200px] px-0 py-16">
    <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#DEE2E6] pb-6 sm:flex-row sm:items-end">
      <div>
        <span className="text-sm font-normal text-[#F49006]">The curated index</span>
        <h2 className="mt-2 text-[34px] font-bold leading-tight text-[#121212] sm:text-[50px] sm:leading-[48px]">
          Master horology houses
        </h2>
      </div>
      <Link className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-[14px] border border-[#DEE2E6] bg-[rgba(18,18,18,0.04)] px-8 text-sm font-normal text-[#121212] no-underline transition hover:border-[#A7A7A7] hover:bg-[rgba(18,18,18,0.08)]" to="/watches">
        View registry
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>

    {brands.length > 0 ? (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {brands.slice(0, 8).map((brand) => {
          const brandImage = getCatalogImage(brand)

          return (
            <Link className="group relative aspect-[4/5] overflow-hidden rounded-[20px] border border-[#DEE2E6] bg-[#121212] text-white no-underline shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)] transition hover:shadow-[16px_18px_16px_0_rgba(0,0,0,0.1)]" key={getId(brand)} to={`/watches?brand=${encodeURIComponent(getCatalogValue(brand))}`}>
              <img className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-65" src={brandImage || lifestyleFallback} alt={getTitle(brand)} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent" />
              <div className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-[#F49006] opacity-0 transition group-hover:opacity-100">
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-[20px] border border-white bg-white/20 p-4 backdrop-blur">
                <p className="text-sm font-normal text-white/80">Collection</p>
                <h3 className="mt-1 text-xl font-bold text-white">{getTitle(brand)}</h3>
              </div>
            </Link>
          )
        })}
      </div>
    ) : (
      <div className="flex min-h-48 items-center justify-center border border-dashed border-[#DEE2E6] bg-[#F8F9FA] p-6 text-center text-[#6C757D]">
        No registry records found
      </div>
    )}
  </section>
)
