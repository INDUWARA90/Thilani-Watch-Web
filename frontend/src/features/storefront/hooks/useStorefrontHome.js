import { useQueries } from '@tanstack/react-query'
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
  const results = useQueries({
    queries: homeQueries.map(({ fallbackMessage, key, normalizeKeys, request }) => ({
      queryKey: ['storefront', 'home', key],
      queryFn: request,
      select: (payload) => normalizeList(payload, normalizeKeys),
      meta: { fallbackMessage },
    })),
  })

  const home = homeQueries.reduce((sections, { key }, index) => ({
    ...sections,
    [key]: results[index].data ?? emptyHome[key],
  }), emptyHome)
  const loading = homeQueries.reduce((sections, { key }, index) => ({
    ...sections,
    [key]: results[index].isLoading,
  }), {})
  const firstErrorIndex = results.findIndex((result) => result.error)
  const firstError = firstErrorIndex >= 0 ? results[firstErrorIndex] : null
  const error = firstError
    ? getApiErrorMessage(firstError.error, homeQueries[firstErrorIndex].fallbackMessage)
    : ''
  const isLoading = results.some((result) => result.isLoading)

  return { error, home, isLoading, loading }
}

const homeQueries = [
  {
    fallbackMessage: 'Unable to load featured watches.',
    key: 'featured',
    normalizeKeys: ['watches', 'featured'],
    request: storefrontApi.getFeaturedWatches,
  },
  {
    fallbackMessage: 'Unable to load new arrivals.',
    key: 'newArrivals',
    normalizeKeys: ['watches', 'newArrivals'],
    request: storefrontApi.getNewArrivals,
  },
  {
    fallbackMessage: 'Unable to load best sellers.',
    key: 'bestSellers',
    normalizeKeys: ['watches', 'bestSellers'],
    request: storefrontApi.getBestSellers,
  },
  {
    fallbackMessage: 'Unable to load categories.',
    key: 'categories',
    normalizeKeys: ['categories'],
    request: storefrontApi.getCategories,
  },
  {
    fallbackMessage: 'Unable to load brands.',
    key: 'brands',
    normalizeKeys: ['brands'],
    request: storefrontApi.getBrands,
  },
]
