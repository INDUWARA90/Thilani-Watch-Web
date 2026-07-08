import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { Link } from 'react-router'
import heroImage from '@/assets/hero.png'
import { LoadingState } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { WatchSection } from '@/features/storefront/components/WatchSection'
import { storefrontApi } from '@/features/storefront/api/storefrontApi'
import { getCatalogImage, getCatalogValue, getId, getTitle, normalizeList } from '@/features/storefront/lib/storefrontUtils'

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
    return <LoadingState label="Curating the storefront" variant="detail" />
  }

  return (
    <main>
      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}

      <section className="relative overflow-hidden rounded-lg bg-slate-950 text-white shadow-[0_28px_90px_rgba(15,23,42,0.22)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.22),transparent_32%),linear-gradient(120deg,rgba(17,24,39,0.92),rgba(17,24,39,0.62))]" />
        <img className="absolute inset-0 h-full w-full object-cover opacity-35" src={heroImage} alt="" aria-hidden="true" />
        <div className="relative grid min-h-[560px] items-center gap-8 p-6 md:grid-cols-[1fr_420px] md:p-10 lg:p-14">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="mb-4 inline-flex rounded-full border border-[#D4AF37]/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37] backdrop-blur">
              Thilani Watch Web
            </p>
            <h1 className="mb-5 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">Luxury watches for moments that deserve precision.</h1>
            <p className="mb-8 max-w-2xl text-lg leading-8 text-slate-200">
              Explore featured pieces, new arrivals, and trusted brands in a refined shopping experience built for collectors and everyday elegance.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-5 font-extrabold text-slate-950 no-underline transition hover:bg-white" to="/watches">
                Shop watches <ArrowRight className="h-4 w-4" />
              </Link>
              <Link className="inline-flex min-h-12 w-fit items-center justify-center rounded-lg border border-white/25 bg-white/10 px-5 font-extrabold text-white no-underline backdrop-blur transition hover:bg-white hover:text-slate-950" to="/watches?featured=true">
                View featured
              </Link>
            </div>
          </motion.div>
          <motion.div className="hidden rounded-lg border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur md:block" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55, delay: 0.15 }}>
            <img className="aspect-[4/5] w-full rounded-lg object-cover" src={heroImage} alt="Luxury wristwatch" />
          </motion.div>
        </div>
      </section>

      <section className="grid gap-3 py-8 sm:grid-cols-3">
        {[
          [ShieldCheck, 'Authenticated quality', 'Carefully presented pieces with clear stock and product details.'],
          [Truck, 'Smooth checkout', 'Cart, wishlist, shipping, and order flows remain connected to the API.'],
          [BadgeCheck, 'Premium service', 'A cleaner experience from discovery through account dashboard.'],
        ].map(([Icon, title, copy]) => (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={title}>
            <Icon className="mb-4 h-7 w-7 text-[#8f6f10]" />
            <h2 className="mb-2 text-lg font-black text-slate-950">{title}</h2>
            <p className="text-sm leading-6 text-slate-600">{copy}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#D4AF37]/15 text-[#8f6f10]">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#8f6f10]">Luxury brands</p>
            <h2 className="text-2xl font-black text-slate-950">Explore By House</h2>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {state.brands.slice(0, 8).map((brand) => (
            <Link className="group rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-950 no-underline transition hover:border-[#D4AF37] hover:bg-white hover:shadow-lg hover:shadow-slate-950/5" key={getId(brand)} to={`/watches?brand=${encodeURIComponent(getCatalogValue(brand))}`}>
              <img className="mb-3 h-14 w-14 rounded-lg bg-white object-cover" src={getCatalogImage(brand) || '/favicon.svg'} alt={getTitle(brand)} />
              <strong className="block font-black group-hover:text-[#8f6f10]">{getTitle(brand)}</strong>
              {brand.description && <span className="mt-1 line-clamp-2 block text-sm text-slate-600">{brand.description}</span>}
            </Link>
          ))}
        </div>
      </section>

      <WatchSection title="Featured Watches" watches={state.featured.slice(0, 4)} />
      <WatchSection title="New Arrivals" watches={state.newArrivals.slice(0, 4)} />
      <WatchSection title="Best Sellers" watches={state.bestSellers.slice(0, 4)} />

      <section className="grid gap-5 py-8 lg:grid-cols-2">
        <CatalogEntryList items={state.categories} paramName="category" title="Shop By Category" />
        <CatalogEntryList items={state.brands} paramName="brand" title="Shop By Brand" />
      </section>

      <section className="rounded-lg bg-slate-950 p-6 text-white sm:p-8">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37]">Newsletter</p>
        <div className="grid gap-5 md:grid-cols-[1fr_360px] md:items-center">
          <div>
            <h2 className="mb-2 text-2xl font-black">Stay ahead of the next collection.</h2>
            <p className="text-slate-300">Get a refined digest of new arrivals, best sellers, and curated watch edits.</p>
          </div>
          <form className="flex gap-2" onSubmit={(event) => event.preventDefault()}>
            <input className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/10 px-3 py-3 font-semibold text-white outline-none placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15" placeholder="Email address" type="email" />
            <button className="rounded-lg bg-[#D4AF37] px-4 font-extrabold text-slate-950 hover:bg-white" type="submit">Join</button>
          </form>
        </div>
      </section>
    </main>
  )
}

const CatalogEntryList = ({ items, paramName, title }) => (
  <div>
    <h2 className="mb-4 text-2xl font-black text-slate-950">{title}</h2>
    <div className="grid gap-3 sm:grid-cols-2">
      {items.slice(0, 8).map((item) => (
        <Link className="rounded-lg border border-slate-200 bg-white p-4 text-slate-950 no-underline shadow-sm transition hover:border-[#D4AF37] hover:shadow-lg hover:shadow-slate-950/5" key={getId(item)} to={`/watches?${paramName}=${encodeURIComponent(getCatalogValue(item))}`}>
          <div className="flex items-center gap-3">
            <img className="h-12 w-12 rounded-lg bg-slate-100 object-cover" src={getCatalogImage(item) || '/favicon.svg'} alt={getTitle(item)} />
            <div>
              <strong className="block">{getTitle(item)}</strong>
              {item.description && <span className="mt-1 block text-sm text-slate-600">{item.description}</span>}
            </div>
          </div>
        </Link>
      ))}
      {items.length === 0 && <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 font-bold text-slate-600">No entries found.</div>}
    </div>
  </div>
)
