import { useEffect, useState } from 'react'
import { LoadingState } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { BrandBar } from '@/features/storefront/components/BrandBar'
import { DummyContent } from '@/features/storefront/components/DummyContent'
import { FeatureGrid } from '@/features/storefront/components/FeatureGrid'
import { HomeSlider } from '@/features/storefront/components/HomeSlider'
import { WatchSection } from '@/features/storefront/components/WatchSection'
import { storefrontApi } from '@/features/storefront/api/storefrontApi'
import { normalizeList } from '@/features/storefront/lib/storefrontUtils'

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
      {error && <div className="mb-5 border border-[#DC3545] bg-red-50 px-4 py-3 font-normal text-[#DC3545]">{error}</div>}

      <HomeSlider />
      <BrandBar brands={state.brands} />
      <DummyContent
        actionLabel="Explore collection"
        copy="Discover a clean mix of dress watches, everyday pieces, and statement designs selected for customers who want a simple premium shopping experience."
        eyebrow="Time with character"
        title="A refined watch store made for modern buyers."
        to="/watches"
      />
      <WatchSection title="New Arrivals" watches={state.newArrivals.slice(0, 4)} />
      <FeatureGrid />
    </main>
  )
}
