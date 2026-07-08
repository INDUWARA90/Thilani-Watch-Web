import { useEffect, useMemo, useState } from 'react'
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
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-extrabold uppercase tracking-normal text-teal-700">Storefront</p>
          <h1 className="text-4xl font-bold leading-tight text-slate-950">Watches</h1>
        </div>
        <Link className="font-bold text-teal-700 no-underline hover:underline" to="/">
          Back home
        </Link>
      </div>

      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" placeholder="Search watches" value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} />
          <select className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
            <option value="">Any category</option>
            {categories.map((category) => (
              <option key={getId(category)} value={getCatalogValue(category)}>{getTitle(category)}</option>
            ))}
          </select>
          <select className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" value={filters.brand} onChange={(event) => updateFilter('brand', event.target.value)}>
            <option value="">Any brand</option>
            {brands.map((brand) => (
              <option key={getId(brand)} value={getCatalogValue(brand)}>{getTitle(brand)}</option>
            ))}
          </select>
          <select className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" min="0" placeholder="Min price" type="number" value={filters.minPrice} onChange={(event) => updateFilter('minPrice', event.target.value)} />
          <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" min="0" placeholder="Max price" type="number" value={filters.maxPrice} onChange={(event) => updateFilter('maxPrice', event.target.value)} />
          <select className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" value={filters.stock} onChange={(event) => updateFilter('stock', event.target.value)}>
            <option value="">Any stock</option>
            <option value="true">In stock</option>
            <option value="false">Out of stock</option>
          </select>
          <select className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" value={filters.featured} onChange={(event) => updateFilter('featured', event.target.value)}>
            <option value="">Any featured</option>
            <option value="true">Featured only</option>
            <option value="false">Not featured</option>
          </select>
        </div>
      </section>

      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}
      {isLoading ? (
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 font-bold text-emerald-950">Loading watches...</div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {watches.map((watch) => (
              <WatchCard key={getId(watch)} watch={watch} />
            ))}
          </div>
          {watches.length === 0 && <div className="rounded-lg border border-slate-200 bg-white px-4 py-5 font-bold text-slate-600">No watches match these filters.</div>}
          <Pagination pagination={pagination} updateFilter={updateFilter} />
        </>
      )}
    </main>
  )
}

const Pagination = ({ pagination, updateFilter }) => (
  <div className="mt-6 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
    <p className="font-bold text-slate-700">
      Page {pagination.page} of {pagination.pages} · {pagination.total} watches
    </p>
    <div className="flex gap-2">
      <button className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 font-extrabold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" disabled={!pagination.hasPrevPage} type="button" onClick={() => updateFilter('page', String(Math.max(1, pagination.page - 1)))}>
        Previous
      </button>
      <button className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 font-extrabold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" disabled={!pagination.hasNextPage} type="button" onClick={() => updateFilter('page', String(pagination.page + 1))}>
        Next
      </button>
    </div>
  </div>
)
