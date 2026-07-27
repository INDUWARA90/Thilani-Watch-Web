import { Filter, Search, SlidersHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
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

const fieldClass = 'h-11 min-w-0 w-full rounded-lg border border-white/20 bg-black/45 px-3.5 text-base font-normal text-white outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/15 placeholder:text-white/75'

export const WatchListingPage = () => {
  usePageTitle('Shop Watches | Thilani Watch Web')

  const { brands, categories, error, filters, isLoading, pagination, searchValue, setSearchValue, updateFilter, watches } = useWatchListing()

  return (
    <main className="min-h-screen overflow-x-hidden bg-base pb-16">
      <section className="relative overflow-hidden bg-base px-4 pb-28 pt-20 text-white sm:px-6 sm:pt-24 lg:px-10">
        <div className="relative z-10 mx-auto flex max-w-[1200px] min-w-0 flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl min-w-0">
            <p className="mb-4 inline-flex min-h-9 items-center rounded-full border border-white/15 bg-white/5 px-4 text-xs font-semibold uppercase text-white/75 backdrop-blur-sm">
              Storefront
            </p>
            <h1 className="break-words font-heading text-4xl font-bold leading-[1.05] text-white drop-shadow-[0_0_28px_rgba(255,255,255,0.35)] sm:text-[56px] lg:text-[72px]">
              Watches Collection
            </h1>
            <p className="mt-4 text-sm font-normal leading-relaxed text-white/75 sm:text-base lg:text-lg">
              Discover our masterfully engineered collection. Filter curated watches by house, collection, price, availability, and popularity.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.03 }}>
            <Link className="inline-flex min-h-11 w-fit max-w-full shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 text-sm font-bold text-white no-underline shadow-sm transition hover:border-white/45 hover:shadow-glowSm active:scale-98 sm:mb-2 sm:px-8" to="/">
              Back home
            </Link>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute bottom-8 left-1/2 h-24 w-[min(980px,92vw)] -translate-x-1/2" aria-hidden="true">
          <div className="glow-beam absolute left-0 top-1/2 h-px w-full bg-white/70 shadow-glow" />
          <div className="glow-beam absolute left-1/2 top-4 h-28 w-[80%] -translate-x-1/2 rounded-[50%] border-t border-white/45" />
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] min-w-0 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-10">
        <aside className="flex h-fit flex-col gap-5 rounded-lg border border-white/12 bg-surface p-5 shadow-glowSm lg:sticky lg:top-28">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Filter className="h-5 w-5 text-white/70" />
            <h2 className="font-heading text-lg font-bold text-white">Filters</h2>
          </div>
          <div className="flex flex-col gap-4">
            <label className="grid gap-1.5 text-sm font-medium text-white/75">
              Search
              <span className="flex h-11 items-center rounded-lg border border-white/12 bg-black/35 px-3.5 transition focus-within:border-white/45 focus-within:ring-2 focus-within:ring-white/10">
                <Search className="h-4 w-4 shrink-0 text-white/70" />
                <input className="min-w-0 flex-1 bg-transparent px-2.5 text-base font-normal text-white outline-none placeholder:text-white/70" placeholder="Search watches..." value={searchValue} onChange={(event) => setSearchValue(event.target.value)} />
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
              <span className="text-sm font-medium text-white/75">Price Range</span>
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

        <section className="min-w-0 overflow-hidden">
          <div className="mb-6 flex flex-col gap-4 rounded-lg border border-white/12 bg-surface p-5 shadow-glowSm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-white/75">{pagination.total || watches.length} watches found</p>
              <h2 className="mt-0.5 font-heading text-xl font-bold text-white">Collection Results</h2>
            </div>
            <label className="flex w-full min-w-0 flex-wrap items-center gap-3 text-sm font-medium text-white/75 sm:w-auto sm:flex-nowrap">
              <span className="flex items-center gap-1.5 whitespace-nowrap text-white"><SlidersHorizontal className="h-4 w-4 text-white/75" /> Sort by</span>
              <div className="min-w-0 flex-1 sm:w-48 sm:flex-none">
                <select className={`${fieldClass} !h-10`} value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          {error && <div className="mb-6 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3.5 font-medium text-red-200 shadow-sm">{error}</div>}
          
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
                <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-4 py-16 text-center font-medium text-white/65 shadow-sm">
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
  <label className="grid gap-1.5 text-sm font-medium text-white/75">
    {label}
    <select className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)}>
      {children}
    </select>
  </label>
)

const Pagination = ({ pagination, updateFilter }) => (
  <div className="mt-8 flex flex-col gap-4 rounded-lg border border-white/12 bg-surface p-4 shadow-glowSm sm:flex-row sm:items-center sm:justify-between">
    <p className="min-w-0 break-words pl-2 text-sm font-medium text-white/65 [&_span]:!text-white">
      Page <span className="font-semibold text-white">{pagination.page}</span> of <span className="font-semibold text-white">{pagination.pages}</span> - <span className="text-white/75">{pagination.total} timepieces</span>
    </p>
    <div className="grid grid-cols-2 gap-3 sm:flex">
      <button className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 text-sm font-bold text-white transition hover:border-white/40 hover:shadow-glowSm disabled:cursor-not-allowed disabled:opacity-50 active:scale-98 sm:px-6" disabled={!pagination.hasPrevPage} type="button" onClick={() => updateFilter('page', String(Math.max(1, pagination.page - 1)))}>
        Previous
      </button>
      <button className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-white px-4 text-sm font-bold text-black transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50 active:scale-98 sm:px-6" disabled={!pagination.hasNextPage} type="button" onClick={() => updateFilter('page', String(pagination.page + 1))}>
        Next
      </button>
    </div>
  </div>
)
