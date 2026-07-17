import { useEffect, useState } from 'react'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { storefrontApi } from '@/features/storefront/api/storefrontApi'
import { normalizeList } from '@/features/storefront/lib/storefrontUtils'

const emptyHome = {
  bestSellers: [],
  brands: [],
  categories: [],
  featured: [],
  newArrivals: [],
}

export const useStorefrontHome = () => {
  const [error, setError] = useState('')
  const [home, setHome] = useState(emptyHome)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    const loadHome = async () => {
      setIsLoading(true)
      setError('')
      try {
        const [featured, newArrivals, bestSellers, categories, brands] = await Promise.all([
          storefrontApi.getFeaturedWatches(),
          storefrontApi.getNewArrivals(),
          storefrontApi.getBestSellers(),
          storefrontApi.getCategories(),
          storefrontApi.getBrands(),
        ])

        if (!isActive) return
        setHome({
          bestSellers: normalizeList(bestSellers, ['watches', 'bestSellers']),
          brands: normalizeList(brands, ['brands']),
          categories: normalizeList(categories, ['categories']),
          featured: normalizeList(featured, ['watches', 'featured']),
          newArrivals: normalizeList(newArrivals, ['watches', 'newArrivals']),
        })
      } catch (apiError) {
        if (isActive) setError(getApiErrorMessage(apiError, 'Unable to load storefront.'))
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    loadHome()
    return () => {
      isActive = false
    }
  }, [])

  return { error, home, isLoading }
}
