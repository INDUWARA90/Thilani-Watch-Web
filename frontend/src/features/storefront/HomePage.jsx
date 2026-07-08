import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import heroImage from '../../assets/hero.png'
import { getApiErrorMessage } from '../../lib/apiClient'
import { usePageTitle } from '../../lib/usePageTitle'
import { WatchSection } from './components/WatchSection'
import { storefrontApi } from './storefrontApi'
import { getCatalogImage, getCatalogValue, getId, getTitle, normalizeList } from './storefrontUtils'

export const HomePage = () => {
  usePageTitle('Thilani Watch Web | Luxury Watches')

  const [state, setState] = useState({
    bestSellers: [],
    brands: [],
    categories: [],
    featured: [],
    isLoading: true,
    newArrivals: [],
  })
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadHome = async () => {
      try {
        const [featured, newArrivals, bestSellers, categories, brands] = await Promise.all([
          storefrontApi.getFeaturedWatches(),
          storefrontApi.getNewArrivals(),
          storefrontApi.getBestSellers(),
          storefrontApi.getCategories(),
          storefrontApi.getBrands(),
        ])

        if (isMounted) {
          setState({
            bestSellers: normalizeList(bestSellers, ['watches', 'bestSellers']),
            brands: normalizeList(brands, ['brands']),
            categories: normalizeList(categories, ['categories']),
            featured: normalizeList(featured, ['watches', 'featured']),
            isLoading: false,
            newArrivals: normalizeList(newArrivals, ['watches', 'newArrivals']),
          })
          setError('')
        }
      } catch (apiError) {
        if (isMounted) {
          setError(getApiErrorMessage(apiError, 'Unable to load storefront.'))
          setState((current) => ({ ...current, isLoading: false }))
        }
      }
    }

    loadHome()

    return () => {
      isMounted = false
    }
  }, [])

  if (state.isLoading) {
    return <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 font-bold text-emerald-950">Loading storefront...</div>
  }

  return (
    <main>
      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}

      <section className="grid min-h-[420px] items-center gap-8 rounded-lg bg-slate-950 p-6 text-white shadow-[0_18px_60px_rgba(28,41,56,0.16)] md:grid-cols-[1fr_420px] md:p-10">
        <div>
          <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-teal-300">Thilani Watch Web</p>
          <h1 className="mb-4 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">Find the watch that fits your moment.</h1>
          <p className="mb-7 max-w-2xl text-lg text-slate-200">
            Explore featured pieces, new arrivals, and trusted brands from one clean storefront.
          </p>
          <Link className="inline-flex min-h-11 w-fit items-center justify-center rounded-lg bg-teal-500 px-5 font-extrabold text-slate-950 no-underline hover:bg-teal-400" to="/watches">
            Shop watches
          </Link>
        </div>
        <img className="aspect-[4/3] w-full rounded-lg object-cover" src={heroImage} alt="Luxury wristwatch" />
      </section>

      <WatchSection title="Featured Watches" watches={state.featured.slice(0, 4)} />
      <WatchSection title="New Arrivals" watches={state.newArrivals.slice(0, 4)} />
      <WatchSection title="Best Sellers" watches={state.bestSellers.slice(0, 4)} />

      <section className="grid gap-5 py-8 lg:grid-cols-2">
        <CatalogEntryList items={state.categories} paramName="category" title="Shop By Category" />
        <CatalogEntryList items={state.brands} paramName="brand" title="Shop By Brand" />
      </section>
    </main>
  )
}

const CatalogEntryList = ({ items, paramName, title }) => (
  <div>
    <h2 className="mb-4 text-2xl font-bold text-slate-950">{title}</h2>
    <div className="grid gap-3 sm:grid-cols-2">
      {items.slice(0, 8).map((item) => (
        <Link
          className="rounded-lg border border-slate-200 bg-white p-4 text-slate-950 no-underline hover:border-teal-300 hover:bg-teal-50"
          key={getId(item)}
          to={`/watches?${paramName}=${encodeURIComponent(getCatalogValue(item))}`}
        >
          <div className="flex items-center gap-3">
            <img className="h-12 w-12 rounded-lg bg-slate-100 object-cover" src={getCatalogImage(item) || '/favicon.svg'} alt={getTitle(item)} />
            <div>
              <strong className="block">{getTitle(item)}</strong>
              {item.description && <span className="mt-1 block text-sm text-slate-600">{item.description}</span>}
            </div>
          </div>
        </Link>
      ))}
      {items.length === 0 && <div className="rounded-lg border border-slate-200 bg-white p-4 font-bold text-slate-600">No entries found.</div>}
    </div>
  </div>
)
