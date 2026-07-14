import { useEffect, useMemo, useState } from 'react'
import { Filter, Search, SlidersHorizontal } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { LoadingState } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { WatchCard } from '@/features/storefront/components/WatchCard'
import { storefrontApi } from '@/features/storefront/api/storefrontApi'
import { getCatalogValue, getId, getTitle, normalizeList, normalizePagination } from '@/features/storefront/lib/storefrontUtils'

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price low to high', value: 'price_asc' },
  { label: 'Price high to low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
  { label: 'Popularity', value: 'popularity' },
]

const fieldClass = 'min-h-[45px] min-w-0 border border-[#DEE2E6] bg-white px-[15px] py-3 text-base font-normal text-[#121212] outline-none transition focus:border-[#0D6EFD] focus:ring-2 focus:ring-[#0D6EFD]/25'

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
    <main className="-mx-4 -mt-8 bg-white sm:-mx-6 lg:-mx-8">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F49006_0%,#EB960E_100%)] px-4 pb-28 pt-16 text-white sm:px-6 sm:pt-20 lg:px-10">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-4 inline-flex min-h-11 items-center rounded-[14px] border border-white bg-white/20 px-5 text-sm font-normal text-white">Storefront</p>
            <h1 className="text-[44px] font-extrabold leading-[1.1] text-white sm:text-[56px] lg:text-[65px] lg:leading-[71px]">Watches</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white sm:text-lg lg:text-[22px] lg:leading-[31px]">Filter curated watches by house, collection, price, stock, and popularity.</p>
          </div>
          <Link className="inline-flex min-h-11 w-fit items-center justify-center rounded-[14px] bg-[#121212] px-8 text-sm font-normal text-white no-underline transition hover:bg-[#272222]" to="/">
            Back home
          </Link>
        </div>
        <svg className="absolute bottom-[-1px] left-0 h-20 w-full text-white" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0 70L60 62.7C120 55 240 41 360 49.3C480 58 600 88 720 92.7C840 98 960 77 1080 63.3C1200 50 1320 44 1380 41.3L1440 39V120H0V70Z" />
        </svg>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-5 px-4 py-12 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-10">
        <aside className="h-fit border border-[#DEE2E6] bg-white p-5 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)] lg:sticky lg:top-28">
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#F49006]" />
            <h2 className="text-lg font-bold text-[#121212]">Filters</h2>
          </div>
          <div className="grid gap-3">
            <label className="grid gap-2 text-base font-normal text-[#121212]">
              Search
              <span className="flex items-center border border-[#DEE2E6] bg-white px-[15px] focus-within:border-[#0D6EFD] focus-within:ring-2 focus-within:ring-[#0D6EFD]/25">
                <Search className="h-4 w-4 text-[#6C757D]" />
                <input className="min-h-[45px] min-w-0 flex-1 bg-transparent px-2 text-base font-normal text-[#121212] outline-none" placeholder="Search watches" value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} />
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
          <div className="mb-5 flex flex-col gap-3 border border-[#DEE2E6] bg-white p-4 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-normal text-[#6C757D]">{pagination.total || watches.length} watches found</p>
              <h2 className="text-xl font-bold text-[#121212]">Collection Results</h2>
            </div>
            <label className="flex items-center gap-2 text-sm font-normal text-[#121212]">
              <SlidersHorizontal className="h-4 w-4" />
              Sort
              <select className={fieldClass} value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          {error && <div className="mb-5 border border-[#DC3545] bg-red-50 px-4 py-3 font-normal text-[#DC3545]">{error}</div>}
          {isLoading ? (
            <LoadingState label="Finding matching watches" variant="cards" rows={6} />
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {watches.map((watch) => (
                  <WatchCard key={getId(watch)} watch={watch} />
                ))}
              </div>
              {watches.length === 0 && <div className="border border-dashed border-[#DEE2E6] bg-[#F8F9FA] px-4 py-10 text-center font-normal text-[#6C757D]">No watches match these filters.</div>}
              <Pagination pagination={pagination} updateFilter={updateFilter} />
            </>
          )}
        </section>
      </section>
    </main>
  )
}

const FilterSelect = ({ children, label, onChange, value }) => (
  <label className="grid gap-2 text-base font-normal text-[#121212]">
    {label}
    <select className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)}>
      {children}
    </select>
  </label>
)

const Pagination = ({ pagination, updateFilter }) => (
  <div className="mt-6 flex flex-col gap-3 border border-[#DEE2E6] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
    <p className="font-normal text-[#212529]">
      Page {pagination.page} of {pagination.pages} - {pagination.total} watches
    </p>
    <div className="flex gap-2">
      <button className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[14px] border border-[#DEE2E6] bg-[rgba(18,18,18,0.04)] px-8 text-sm font-normal text-[#121212] transition hover:bg-[rgba(18,18,18,0.08)] disabled:cursor-not-allowed disabled:opacity-50" disabled={!pagination.hasPrevPage} type="button" onClick={() => updateFilter('page', String(Math.max(1, pagination.page - 1)))}>
        Previous
      </button>
      <button className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[14px] bg-[#121212] px-8 text-sm font-normal text-white transition hover:bg-[#272222] disabled:cursor-not-allowed disabled:opacity-50" disabled={!pagination.hasNextPage} type="button" onClick={() => updateFilter('page', String(pagination.page + 1))}>
        Next
      </button>
    </div>
  </div>
)
