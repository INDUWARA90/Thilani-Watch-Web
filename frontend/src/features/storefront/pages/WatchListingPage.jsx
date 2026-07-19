import { Filter, Search, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router'
import { LoadingState } from '@/shared/ui/LoadingState'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { WatchCard } from '@/features/storefront/components/WatchCard'
import { useWatchListing } from '@/features/storefront/hooks/useWatchListing'
import { getCatalogValue, getId, getTitle } from '@/features/storefront/lib/storefrontUtils'

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price low to high', value: 'price_asc' },
  { label: 'Price high to low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
  { label: 'Popularity', value: 'popularity' },
]

const fieldClass = 'h-11 min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-base font-normal text-[#121212] outline-none transition focus:border-[#0D6EFD] focus:ring-2 focus:ring-[#0D6EFD]/25 placeholder:text-slate-400'

export const WatchListingPage = () => {
  usePageTitle('Shop Watches | Thilani Watch Web')

  const { brands, categories, error, filters, isLoading, pagination, searchValue, setSearchValue, updateFilter, watches } = useWatchListing()

  return (
    <main className="-mx-4 -mt-8 bg-white sm:-mx-6 lg:-mx-8 min-h-screen pb-16">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F49006_0%,#EB960E_100%)] px-4 pb-32 pt-16 text-white sm:px-6 sm:pt-20 lg:px-10">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between relative z-10">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex min-h-9 items-center rounded-full border border-white/30 bg-white/10 px-4 text-xs font-medium tracking-wide uppercase text-white backdrop-blur-sm">
              Storefront
            </p>
            <h1 className="text-[44px] font-black leading-[1.1] text-white sm:text-[56px] lg:text-[65px] lg:leading-[71px] tracking-tight">
              Watches
            </h1>
            <p className="mt-3 text-sm font-normal text-white/80 sm:text-base lg:text-lg leading-relaxed">
              Discover our masterfully engineered collection. Filter curated watches by house, collection, price, availability, and popularity.
            </p>
          </div>
          <Link className="inline-flex min-h-11 w-fit items-center justify-center rounded-[14px] bg-[#121212] px-8 text-sm font-medium text-white no-underline transition shadow-sm hover:bg-[#272222] active:scale-98 shrink-0 sm:mb-2" to="/">
            Back home
          </Link>
        </div>
        <svg className="absolute bottom-[-1px] left-0 h-20 w-full text-white" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0 70L60 62.7C120 55 240 41 360 49.3C480 58 600 88 720 92.7C840 98 960 77 1080 63.3C1200 50 1320 44 1380 41.3L1440 39V120H0V70Z" />
        </svg>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-10">
        <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] lg:sticky lg:top-28 flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Filter className="h-5 w-5 text-[#F49006]" />
            <h2 className="text-lg font-bold text-[#121212]">Filters</h2>
          </div>
          <div className="flex flex-col gap-4">
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              Search
              <span className="flex items-center h-11 rounded-xl border border-slate-200 bg-white px-3.5 transition focus-within:border-[#0D6EFD] focus-within:ring-2 focus-within:ring-[#0D6EFD]/25">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <input className="min-w-0 flex-1 bg-transparent px-2.5 text-base font-normal text-[#121212] outline-none placeholder:text-slate-400" placeholder="Search watches..." value={searchValue} onChange={(event) => setSearchValue(event.target.value)} />
              </span>
            </label>
            
            <FilterSelect label="Category" value={filters.category} onChange={(value) => updateFilter('category', value)}>
              <option value="">Any category</option>
              {categories.map((category) => (
                <option key={getId(category)} value={getCatalogValue(category)}>{getTitle(category)}</option>
              ))}
            </FilterSelect>
            
            <FilterSelect label="Brand" value={filters.brand} onChange={(value) => updateFilter('brand', value)}>
              <option value="">Any brand</option>
              {brands.map((brand) => (
                <option key={getId(brand)} value={getCatalogValue(brand)}>{getTitle(brand)}</option>
              ))}
            </FilterSelect>

            <FilterSelect label="Gender" value={filters.gender} onChange={(value) => updateFilter('gender', value)}>
              <option value="">Any gender</option>
              <option value="ladies">Ladies</option>
              <option value="gents">Gents</option>
              <option value="unisex">Unisex</option>
            </FilterSelect>
            
            <div className="grid gap-1.5">
              <span className="text-sm font-medium text-slate-700">Price Range</span>
              <div className="grid grid-cols-2 gap-3">
                <input className={fieldClass} min="0" placeholder="Min price" type="number" value={filters.minPrice} onChange={(event) => updateFilter('minPrice', event.target.value)} />
                <input className={fieldClass} min="0" placeholder="Max price" type="number" value={filters.maxPrice} onChange={(event) => updateFilter('maxPrice', event.target.value)} />
              </div>
            </div>
            
            <FilterSelect label="Stock" value={filters.stock} onChange={(value) => updateFilter('stock', value)}>
              <option value="">Any stock</option>
              <option value="true">In stock</option>
              <option value="false">Out of stock</option>
            </FilterSelect>
            
            <FilterSelect label="Featured Status" value={filters.featured} onChange={(value) => updateFilter('featured', value)}>
              <option value="">Any featured</option>
              <option value="true">Featured only</option>
              <option value="false">Not featured</option>
            </FilterSelect>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wide uppercase text-slate-400">{pagination.total || watches.length} watches found</p>
              <h2 className="text-xl font-bold text-[#121212] mt-0.5">Collection Results</h2>
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-600 shrink-0">
              <span className="flex items-center gap-1.5 whitespace-nowrap"><SlidersHorizontal className="h-4 w-4 text-slate-400" /> Sort by</span>
              <div className="w-48">
                <select className={`${fieldClass} !h-10`} value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          {error && <div className="mb-6 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3.5 font-medium text-red-600 shadow-sm">{error}</div>}
          
          {isLoading ? (
            <LoadingState label="Finding matching watches" variant="cards" rows={6} />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {watches.map((watch) => (
                  <WatchCard key={getId(watch)} watch={watch} />
                ))}
              </div>
              
              {watches.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-4 py-16 text-center text-slate-500 font-medium shadow-sm">
                  No watches match these filter metrics. Try adjusting your fields.
                </div>
              )}
              
              <Pagination pagination={pagination} updateFilter={updateFilter} />
            </>
          )}
        </section>
      </section>
    </main>
  )
}

const FilterSelect = ({ children, label, onChange, value }) => (
  <label className="grid gap-1.5 text-sm font-medium text-slate-700">
    {label}
    <select className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)}>
      {children}
    </select>
  </label>
)

const Pagination = ({ pagination, updateFilter }) => (
  <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between">
    <p className="text-sm font-medium text-slate-500 pl-2">
      Page <span className="text-[#121212] font-semibold">{pagination.page}</span> of <span className="text-[#121212] font-semibold">{pagination.pages}</span> — <span className="text-slate-600">{pagination.total} timepieces</span>
    </p>
    <div className="flex gap-3">
      <button className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[14px] border border-slate-200 bg-slate-50 px-6 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 active:scale-98" disabled={!pagination.hasPrevPage} type="button" onClick={() => updateFilter('page', String(Math.max(1, pagination.page - 1)))}>
        Previous
      </button>
      <button className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[14px] bg-[#121212] px-6 text-sm font-medium text-white transition hover:bg-[#272222] disabled:cursor-not-allowed disabled:opacity-50 active:scale-98" disabled={!pagination.hasNextPage} type="button" onClick={() => updateFilter('page', String(pagination.page + 1))}>
        Next
      </button>
    </div>
  </div>
)
