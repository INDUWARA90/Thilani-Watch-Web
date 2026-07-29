import { Filter, RotateCcw, Search, SlidersHorizontal } from 'lucide-react'
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

const fieldClass = 'h-11 min-w-0 w-full border border-black/20 bg-white px-3.5 text-xs font-sans text-black outline-none transition-all duration-300 placeholder:text-neutral-400 focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]'

const WatchListingPage = () => {
  usePageTitle('Shop Watches | Thilani Watch Web')

  const { brands, categories, error, filters, isLoading, pagination, resetFilters, searchValue, setSearchValue, updateFilter, watches } = useWatchListing()
  const hasActiveFilters = searchValue || filters.brand || filters.category || filters.featured || filters.gender || filters.maxPrice || filters.minPrice || filters.stock || filters.sort !== 'newest'

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FAF9F5] pb-24 text-black">
      {/* Dark Luxury Editorial Header */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#0D0D0D] px-6 py-20 text-white lg:px-12">
        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Top Bar Navigation & Tag */}
          <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5C518]" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400">
                Curated Vault / 2026 Edition
              </span>
            </div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <Link
                className="inline-flex items-center justify-center border border-white/20 bg-white/5 px-5 py-2 font-sans text-xs font-medium uppercase tracking-[0.2em] text-white no-underline transition-all duration-300 hover:border-[#F5C518] hover:bg-[#F5C518] hover:text-black"
                to="/"
              >
                Back Home
              </Link>
            </motion.div>
          </div>

          {/* Headline and Description Grid */}
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <span className="mb-2 inline-block font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#F5C518]">
                Boutique Gallery
              </span>
              <h1 className="font-serif text-4xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl">
                Timepieces & Fine <br />
                <span className="font-serif italic text-white/70">Engineering.</span>
              </h1>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-4">
              <p className="font-sans text-xs leading-relaxed text-neutral-400 sm:text-sm">
                Explore a handpicked selection of precision timepieces, engineered with Swiss quality and timeless aesthetics.
              </p>

              {/* Stat Chips */}
              <div className="flex flex-wrap gap-3">
                <div className="border border-white/10 bg-white/5 px-4 py-2">
                  <p className="font-mono text-[10px] uppercase text-neutral-400">Catalog</p>
                  <p className="font-serif text-lg text-white">{pagination.total || watches.length} Models</p>
                </div>
                <div className="border border-white/10 bg-white/5 px-4 py-2">
                  <p className="font-mono text-[10px] uppercase text-neutral-400">Houses</p>
                  <p className="font-serif text-lg text-[#F5C518]">{brands.length || '12'} Brands</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="mx-auto grid max-w-7xl min-w-0 gap-10 px-6 py-12 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-12">
        {/* Sticky Filter Sidebar */}
        <aside className="flex h-fit flex-col gap-6 border border-black/10 bg-white p-6 shadow-xl lg:sticky lg:top-28">
          <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-4">
            <div className="flex min-w-0 items-center gap-3">
              <Filter className="h-4 w-4 shrink-0 text-[#F5C518]" />
              <h2 className="min-w-0 font-serif text-lg font-normal uppercase tracking-wider text-black">Refine Selection</h2>
            </div>
            <button
              className="inline-flex shrink-0 items-center justify-center gap-1.5 border border-black/15 bg-transparent px-3 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition-all duration-300 hover:border-[#F5C518] hover:bg-[#F5C518] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!hasActiveFilters}
              type="button"
              onClick={resetFilters}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {/* Search Input */}
            <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-widest text-black">
              Search Catalog
              <span className="flex h-11 items-center border border-black/20 bg-white px-3.5 transition-all focus-within:border-[#F5C518]">
                <Search className="h-4 w-4 shrink-0 text-neutral-400" />
                <input
                  className="min-w-0 flex-1 bg-transparent px-2.5 font-sans text-xs text-black outline-none placeholder:text-neutral-400"
                  placeholder="Search timepieces..."
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                />
              </span>
            </label>

            {/* Category Select */}
            <FilterSelect label="Category" value={filters.category} onChange={(value) => updateFilter('category', value)}>
              <option value="">Any Category</option>
              {categories.map((category) => (
                <option key={getId(category)} value={getCatalogValue(category)}>{getTitle(category)}</option>
              ))}
            </FilterSelect>

            {/* Brand Select */}
            <FilterSelect label="Brand / House" value={filters.brand} onChange={(value) => updateFilter('brand', value)}>
              <option value="">Any Brand</option>
              {brands.map((brand) => (
                <option key={getId(brand)} value={getCatalogValue(brand)}>{getTitle(brand)}</option>
              ))}
            </FilterSelect>

            {/* Gender Select */}
            <FilterSelect label="Gender" value={filters.gender} onChange={(value) => updateFilter('gender', value)}>
              <option value="">Any Gender</option>
              <option value="ladies">Ladies</option>
              <option value="gents">Gents</option>
              <option value="unisex">Unisex</option>
            </FilterSelect>

            {/* Price Range */}
            <div className="grid gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-black">Price Range</span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  className={fieldClass}
                  min="0"
                  placeholder="Min Price"
                  type="number"
                  value={filters.minPrice}
                  onChange={(event) => updateFilter('minPrice', event.target.value)}
                />
                <input
                  className={fieldClass}
                  min="0"
                  placeholder="Max Price"
                  type="number"
                  value={filters.maxPrice}
                  onChange={(event) => updateFilter('maxPrice', event.target.value)}
                />
              </div>
            </div>

            {/* Stock Select */}
            <FilterSelect label="Stock Availability" value={filters.stock} onChange={(value) => updateFilter('stock', value)}>
              <option value="">All Items</option>
              <option value="true">In Stock Only</option>
              <option value="false">Out of Stock</option>
            </FilterSelect>

            {/* Featured Select */}
            <FilterSelect label="Curated Status" value={filters.featured} onChange={(value) => updateFilter('featured', value)}>
              <option value="">All Statuses</option>
              <option value="true">Featured Collection</option>
              <option value="false">Standard Catalog</option>
            </FilterSelect>
          </div>
        </aside>

        {/* Listing & Results Container */}
        <section className="min-w-0 overflow-hidden">
          {/* Top Control Bar */}
          <div className="mb-8 flex flex-col gap-4 border border-black/10 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                {pagination.total || watches.length} Timepieces
              </p>
              <h2 className="mt-0.5 font-serif text-xl font-normal text-black">Catalog Results</h2>
            </div>

            <label className="flex w-full min-w-0 flex-wrap items-center gap-3 font-sans text-xs sm:w-auto sm:flex-nowrap">
              <span className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-black">
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#F5C518]" /> Sort By
              </span>
              <div className="min-w-0 flex-1 sm:w-48 sm:flex-none">
                <select
                  className={`${fieldClass} !h-10`}
                  value={filters.sort}
                  onChange={(event) => updateFilter('sort', event.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 p-4 font-sans text-xs text-red-800">
              {error}
            </div>
          )}

          {/* Watch Grid / Loading / Empty State */}
          {isLoading ? (
            <LoadingState label="Finding matching watches" rows={6} variant="cards" />
          ) : (
            <>
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {watches.map((watch) => (
                  <WatchCard key={getId(watch)} watch={watch} />
                ))}
              </div>

              {watches.length === 0 && (
                <div className="border border-dashed border-black/20 bg-white px-6 py-20 text-center font-sans text-xs tracking-wider uppercase text-neutral-500">
                  No timepieces match these filter criteria. Please adjust your parameters.
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

export default WatchListingPage

const FilterSelect = ({ children, label, onChange, value }) => (
  <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-widest text-black">
    {label}
    <select className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)}>
      {children}
    </select>
  </label>
)

const Pagination = ({ pagination, updateFilter }) => (
  <div className="mt-12 flex flex-col gap-4 border border-black/10 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
    <p className="min-w-0 break-words font-sans text-xs uppercase tracking-wider text-neutral-500">
      Page <span className="font-semibold text-black">{pagination.page}</span> of{' '}
      <span className="font-semibold text-black">{pagination.pages}</span> —{' '}
      <span className="text-black">{pagination.total} timepieces</span>
    </p>

    <div className="grid grid-cols-2 gap-3 sm:flex">
      <button
        className="inline-flex min-h-11 cursor-pointer items-center justify-center border border-black bg-white px-6 font-sans text-xs font-medium uppercase tracking-[0.2em] text-black transition-all duration-300 hover:border-[#F5C518] hover:bg-[#F5C518] disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!pagination.hasPrevPage}
        type="button"
        onClick={() => updateFilter('page', String(Math.max(1, pagination.page - 1)))}
      >
        Previous
      </button>

      <button
        className="inline-flex min-h-11 cursor-pointer items-center justify-center border border-black bg-black px-6 font-sans text-xs font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-[#F5C518] hover:bg-[#F5C518] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!pagination.hasNextPage}
        type="button"
        onClick={() => updateFilter('page', String(pagination.page + 1))}
      >
        Next
      </button>
    </div>
  </div>
)
