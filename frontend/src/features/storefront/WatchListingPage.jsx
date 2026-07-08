import { useEffect, useMemo, useState } from 'react'
import { Filter, Search, SlidersHorizontal } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { getApiErrorMessage } from '../../lib/apiClient'
import { usePageTitle } from '../../lib/usePageTitle'
import { WatchCard } from './components/WatchCard'
import { storefrontApi } from './storefrontApi'
import { getCatalogValue, getId, getTitle, normalizeList, normalizePagination } from './storefrontUtils'

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price low to high', value: 'price_asc' },
  { label: 'Price high to low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
  { label: 'Popularity', value: 'popularity' },
]

const fieldClass = 'min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15'

export const WatchListingPage = () => {
  usePageTitle('Shop Watches | Thilani Watch Web')

  const [searchParams, setSearchParams] = useSearchParams()
  const [watches, setWatches] = useState([])
  const [pagination, setPagination] = useState(normalizePagination({}))
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const filters = useMemo(
    () => ({
      brand: searchParams.get('brand') || '',
      category: searchParams.get('category') || '',
      featured: searchParams.get('featured') || '',
      limit: searchParams.get('limit') || '12',
      maxPrice: searchParams.get('maxPrice') || '',
      minPrice: searchParams.get('minPrice') || '',
      page: searchParams.get('page') || '1',
      search: searchParams.get('search') || '',
      sort: searchParams.get('sort') || 'newest',
      stock: searchParams.get('stock') || '',
    }),
    [searchParams],
  )

  useEffect(() => {
    let isMounted = true

    const loadReferences = async () => {
      try {
        const [categoryData, brandData] = await Promise.all([storefrontApi.getCategories(), storefrontApi.getBrands()])
        if (isMounted) {
          setCategories(normalizeList(categoryData, ['categories']))
          setBrands(normalizeList(brandData, ['brands']))
        }
      } catch {
        if (isMounted) {
          setCategories([])
          setBrands([])
        }
      }
    }

    loadReferences()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadWatches = async () => {
      setIsLoading(true)
      try {
        const payload = await storefrontApi.getWatches(filters)
        if (isMounted) {
          setWatches(normalizeList(payload, ['watches']))
          setPagination(normalizePagination(payload))
          setError('')
        }
      } catch (apiError) {
        if (isMounted) {
          setError(getApiErrorMessage(apiError, 'Unable to load watches.'))
          setWatches([])
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadWatches()

    return () => {
      isMounted = false
    }
  }, [filters])

  const updateFilter = (name, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(name, value)
    } else {
      next.delete(name)
    }
    if (name !== 'page') next.set('page', '1')
    setSearchParams(next)
  }

  return (
    <main>
      <section className="mb-7 rounded-lg bg-slate-950 p-6 text-white shadow-[0_22px_70px_rgba(15,23,42,0.16)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37]">Storefront</p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">Watches</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Filter curated luxury watches by house, collection, price, stock, and popularity.</p>
          </div>
          <Link className="inline-flex min-h-11 w-fit items-center justify-center rounded-lg border border-white/15 bg-white/10 px-4 font-extrabold text-white no-underline backdrop-blur transition hover:bg-white hover:text-slate-950" to="/">
            Back home
          </Link>
        </div>
      </section>

      <section className="mb-7 grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#8f6f10]" />
            <h2 className="text-lg font-black text-slate-950">Filters</h2>
          </div>
          <div className="grid gap-3">
            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Search
              <span className="flex items-center rounded-lg border border-slate-200 bg-white px-3 focus-within:border-[#D4AF37] focus-within:ring-4 focus-within:ring-[#D4AF37]/15">
                <Search className="h-4 w-4 text-slate-400" />
                <input className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm font-semibold text-slate-950 outline-none" placeholder="Search watches" value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} />
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
            <div className="grid grid-cols-2 gap-3">
              <input className={fieldClass} min="0" placeholder="Min price" type="number" value={filters.minPrice} onChange={(event) => updateFilter('minPrice', event.target.value)} />
              <input className={fieldClass} min="0" placeholder="Max price" type="number" value={filters.maxPrice} onChange={(event) => updateFilter('maxPrice', event.target.value)} />
            </div>
            <FilterSelect label="Stock" value={filters.stock} onChange={(value) => updateFilter('stock', value)}>
              <option value="">Any stock</option>
              <option value="true">In stock</option>
              <option value="false">Out of stock</option>
            </FilterSelect>
            <FilterSelect label="Featured" value={filters.featured} onChange={(value) => updateFilter('featured', value)}>
              <option value="">Any featured</option>
              <option value="true">Featured only</option>
              <option value="false">Not featured</option>
            </FilterSelect>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500">{pagination.total || watches.length} watches found</p>
              <h2 className="text-xl font-black text-slate-950">Collection Results</h2>
            </div>
            <label className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-slate-500">
              <SlidersHorizontal className="h-4 w-4" />
              Sort
              <select className={fieldClass} value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="h-96 animate-pulse rounded-lg border border-slate-200 bg-white" key={index} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {watches.map((watch) => (
                  <WatchCard key={getId(watch)} watch={watch} />
                ))}
              </div>
              {watches.length === 0 && <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-10 text-center font-bold text-slate-600">No watches match these filters.</div>}
              <Pagination pagination={pagination} updateFilter={updateFilter} />
            </>
          )}
        </section>
      </section>
    </main>
  )
}

const FilterSelect = ({ children, label, onChange, value }) => (
  <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
    {label}
    <select className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)}>
      {children}
    </select>
  </label>
)

const Pagination = ({ pagination, updateFilter }) => (
  <div className="mt-6 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
    <p className="font-bold text-slate-700">
      Page {pagination.page} of {pagination.pages} · {pagination.total} watches
    </p>
    <div className="flex gap-2">
      <button className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 font-extrabold text-slate-950 transition hover:border-[#D4AF37] hover:text-[#8f6f10] disabled:cursor-not-allowed disabled:opacity-50" disabled={!pagination.hasPrevPage} type="button" onClick={() => updateFilter('page', String(Math.max(1, pagination.page - 1)))}>
        Previous
      </button>
      <button className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-4 font-extrabold text-white transition hover:bg-[#D4AF37] hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50" disabled={!pagination.hasNextPage} type="button" onClick={() => updateFilter('page', String(pagination.page + 1))}>
        Next
      </button>
    </div>
  </div>
)
