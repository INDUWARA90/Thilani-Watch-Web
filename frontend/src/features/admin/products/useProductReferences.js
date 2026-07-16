import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { normalizeList } from '../lib/adminUtils'

export const useProductReferences = (setError) => {
  const referencesQuery = useQuery({
    queryFn: async () => {
      const [brandData, categoryData] = await Promise.all([adminApi.getBrands(), adminApi.getCategories()])
      return {
        brands: normalizeList(brandData, ['brands']),
        categories: normalizeList(categoryData, ['categories']),
      }
    },
    queryKey: ['admin', 'product-references'],
  })

  useEffect(() => {
    if (referencesQuery.error) {
      setError(getApiErrorMessage(referencesQuery.error, 'Unable to load catalog data.'))
    }
  }, [referencesQuery.error, setError])

  return {
    brands: referencesQuery.data?.brands || [],
    categories: referencesQuery.data?.categories || [],
  }
}
