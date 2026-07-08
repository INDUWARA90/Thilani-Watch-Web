import { useEffect, useState } from 'react'
import { getApiErrorMessage } from '../../../lib/apiClient'
import { adminApi } from '../adminApi'
import { normalizeList } from '../adminUtils'

export const useProductReferences = (setError) => {
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        const [brandData, categoryData] = await Promise.all([adminApi.getBrands(), adminApi.getCategories()])
        if (isMounted) {
          setBrands(normalizeList(brandData, ['brands']))
          setCategories(normalizeList(categoryData, ['categories']))
        }
      } catch (apiError) {
        if (isMounted) {
          setError(getApiErrorMessage(apiError, 'Unable to load catalog data.'))
        }
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [setError])

  return { brands, categories }
}
