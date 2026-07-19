import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { HomeCatalogGrid } from '@/features/storefront/components/HomeCatalogGrid'
import { HomeCtaSection } from '@/features/storefront/components/HomeCtaSection'
import { HomeGuideSection } from '@/features/storefront/components/HomeGuideSection'
import { HomeHero } from '@/features/storefront/components/HomeHero'
import { HomeTrustStrip } from '@/features/storefront/components/HomeTrustStrip'
import { HomeWatchSection } from '@/features/storefront/components/HomeWatchSection'
import { useStorefrontHome } from '@/features/storefront/hooks/useStorefrontHome'
import { fallbackBrands, fallbackCategories } from '@/features/storefront/lib/homeContent'

export const HomePage = () => {
  usePageTitle('Thilani Watch Web | Luxury Watches')
  const { error, home, loading } = useStorefrontHome()

  return (
    <main className="-mx-4 -mt-8 min-h-screen bg-white sm:-mx-6 lg:-mx-8">
      <HomeHero />
      <HomeTrustStrip />

      {error && (
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
          <div className="rounded-[14px] border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-semibold text-red-600">
            {error}
          </div>
        </div>
      )}

      <HomeWatchSection
        eyebrow="Featured"
        isLoading={loading.featured}
        text="Lead customers into the strongest products first with a focused row of premium picks."
        title="Featured watches"
        watches={home.featured}
      />
      <HomeCatalogGrid
        eyebrow="Categories"
        fallbackItems={fallbackCategories}
        filterKey="category"
        isLoading={loading.categories}
        items={home.categories}
        text="Help shoppers start from their preferred use case instead of scanning every watch at once."
        title="Shop by category"
      />
      <HomeWatchSection
        eyebrow="Fresh arrivals"
        isLoading={loading.newArrivals}
        text="Keep the storefront feeling alive with the newest pieces added to the catalog."
        title="New arrivals"
        watches={home.newArrivals}
      />
      <HomeCatalogGrid
        eyebrow="Brands"
        fallbackItems={fallbackBrands}
        filterKey="brand"
        isLoading={loading.brands}
        items={home.brands}
        text="Give brand-focused customers a fast route into the collection they already trust."
        title="Shop by brand"
      />
      <HomeWatchSection
        eyebrow="Popular"
        isLoading={loading.bestSellers}
        text="Show the watches customers are most likely to compare, save, and buy."
        title="Best sellers"
        watches={home.bestSellers}
      />
      <HomeGuideSection />
      <HomeCtaSection />
    </main>
  )
}
