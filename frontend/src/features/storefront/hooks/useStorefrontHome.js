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

const initialLoading = {
  bestSellers: true,
  brands: true,
  categories: true,
  featured: true,
  newArrivals: true,
}

export const useStorefrontHome = () => {
  const [error, setError] = useState('')
  const [home, setHome] = useState(emptyHome)
  const [loading, setLoading] = useState(initialLoading)

  useEffect(() => {
    let isActive = true

    const loadSection = async ({ fallbackMessage, key, normalizeKeys, request }) => {
      try {
        const payload = await request()
        if (!isActive) return
        setHome((current) => ({ ...current, [key]: normalizeList(payload, normalizeKeys) }))
      } catch (apiError) {
        if (isActive) setError(getApiErrorMessage(apiError, fallbackMessage))
      } finally {
        if (isActive) setLoading((current) => ({ ...current, [key]: false }))
      }
    }

    loadSection({
      fallbackMessage: 'Unable to load featured watches.',
      key: 'featured',
      normalizeKeys: ['watches', 'featured'],
      request: storefrontApi.getFeaturedWatches,
    })
    loadSection({
      fallbackMessage: 'Unable to load new arrivals.',
      key: 'newArrivals',
      normalizeKeys: ['watches', 'newArrivals'],
      request: storefrontApi.getNewArrivals,
    })
    loadSection({
      fallbackMessage: 'Unable to load best sellers.',
      key: 'bestSellers',
      normalizeKeys: ['watches', 'bestSellers'],
      request: storefrontApi.getBestSellers,
    })
    loadSection({
      fallbackMessage: 'Unable to load categories.',
      key: 'categories',
      normalizeKeys: ['categories'],
      request: storefrontApi.getCategories,
    })
    loadSection({
      fallbackMessage: 'Unable to load brands.',
      key: 'brands',
      normalizeKeys: ['brands'],
      request: storefrontApi.getBrands,
    })

    return () => {
      isActive = false
    }
  }, [])

  const isLoading = Object.values(loading).some(Boolean)

  return { error, home, isLoading, loading }
}
