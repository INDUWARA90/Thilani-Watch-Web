import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { HomeCatalogGrid } from '@/features/storefront/components/HomeCatalogGrid'
import { HomeCtaSection } from '@/features/storefront/components/HomeCtaSection'
import { HomeGuideSection } from '@/features/storefront/components/HomeGuideSection'
import { HomeHero } from '@/features/storefront/components/HomeHero'
import { HomeInteractiveShowcase } from '@/features/storefront/components/HomeInteractiveShowcase'
import { HomeKineticExperience } from '@/features/storefront/components/HomeKineticExperience'
import { HomeTrustStrip } from '@/features/storefront/components/HomeTrustStrip'
import { HomeWatchConfigurator } from '@/features/storefront/components/HomeWatchConfigurator'
import { HomeWatchSection } from '@/features/storefront/components/HomeWatchSection'
import { useStorefrontHome } from '@/features/storefront/hooks/useStorefrontHome'
import { fallbackBrands, fallbackCategories } from '@/features/storefront/lib/homeContent'

const HomePage = () => {
  usePageTitle('Thilani Watch Web | Luxury Watches')
  const { error, home, loading } = useStorefrontHome()

  return (
    <main className="min-h-screen bg-base">

      {error && (
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
          <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3.5 text-sm font-semibold text-red-200">
            {error}
          </div>
        </div>
      )}


      <HomeHero />
      <HomeTrustStrip />
      <HomeInteractiveShowcase />
      <HomeKineticExperience home={home} loading={loading} />

      <HomeWatchSection
        eyebrow="Featured collection"
        isLoading={loading.featured}
        text="Discover standout timepieces selected for their refined design, reliable movement, and everyday elegance."
        title="Featured watches"
        watches={home.featured}
      />


      <HomeWatchConfigurator />


      <HomeCatalogGrid
        eyebrow="Explore collections"
        fallbackItems={fallbackCategories}
        filterKey="category"
        isLoading={loading.categories}
        items={home.categories}
        text="Choose the style that matches your day, from polished dress watches to durable sport and smart designs."
        title="Shop by category"
      />
      <HomeWatchSection
        eyebrow="Just arrived"
        isLoading={loading.newArrivals}
        text="Explore the newest additions to our collection, refreshed with elegant pieces for work, gifting, and daily wear."
        title="New arrivals"
        watches={home.newArrivals}
      />
      <HomeCatalogGrid
        eyebrow="Trusted names"
        fallbackItems={fallbackBrands}
        filterKey="brand"
        isLoading={loading.brands}
        items={home.brands}
        text="Browse respected watch houses known for dependable craftsmanship, timeless styling, and lasting value."
        title="Shop by brand"
      />
      <HomeWatchSection
        eyebrow="Customer favorites"
        isLoading={loading.bestSellers}
        text="A refined selection of watches loved for their design, comfort, and easy everyday wear."
        title="Best sellers"
        watches={home.bestSellers}
      />
      <HomeGuideSection />
      <HomeCtaSection />
    </main>
  )
}

export default HomePage
