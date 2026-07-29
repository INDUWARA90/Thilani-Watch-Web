import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { normalizeList } from '../lib/adminUtils'

export const useProductReferences = (setError) => {
  const brandsQuery = useQuery({
    queryKey: ['admin', 'brands'],
    queryFn: adminApi.getBrands,
    select: (payload) => normalizeList(payload, ['brands']),
  })
  const categoriesQuery = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: adminApi.getCategories,
    select: (payload) => normalizeList(payload, ['categories']),
  })

  useEffect(() => {
    const apiError = brandsQuery.error || categoriesQuery.error
    if (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load catalog data.'))
    }
  }, [brandsQuery.error, categoriesQuery.error, setError])

  return {
    brands: brandsQuery.data ?? [],
    categories: categoriesQuery.data ?? [],
  }
}
