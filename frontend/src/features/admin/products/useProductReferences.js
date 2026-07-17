import { useEffect, useState } from 'react'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { normalizeList } from '../lib/adminUtils'

export const useProductReferences = (setError) => {
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    let isActive = true

    const loadReferences = async () => {
      try {
        const [brandData, categoryData] = await Promise.all([adminApi.getBrands(), adminApi.getCategories()])
        if (!isActive) return
        setBrands(normalizeList(brandData, ['brands']))
        setCategories(normalizeList(categoryData, ['categories']))
      } catch (apiError) {
        if (isActive) setError(getApiErrorMessage(apiError, 'Unable to load catalog data.'))
      }
    }

    loadReferences()
    return () => {
      isActive = false
    }
  }, [setError])

  return { brands, categories }
}
