import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { storefrontApi } from '@/features/storefront/api/storefrontApi'
import { normalizeList, normalizePagination } from '@/features/storefront/lib/storefrontUtils'

export const useWatchListing = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState(normalizePagination({}))
  const [watches, setWatches] = useState([])

  const filters = useMemo(
    () => ({
      brand: searchParams.get('brand') || '',
      category: searchParams.get('category') || '',
      featured: searchParams.get('featured') || '',
      gender: searchParams.get('gender') || '',
      limit: searchParams.get('limit') || '12',
      maxPrice: searchParams.get('maxPrice') || '',
      minPrice: searchParams.get('minPrice') || '',
      page: searchParams.get('page') || '1',
      search: searchParams.get('search') || '',
      sort: searchParams.get('sort') || 'newest',
      stock: searchParams.get('stock') || '',
    }),
    [searchParams],
  )

  useEffect(() => {
    let isActive = true

    const loadReferences = async () => {
      try {
        const [categoryData, brandData] = await Promise.all([storefrontApi.getCategories(), storefrontApi.getBrands()])
        if (!isActive) return
        setBrands(normalizeList(brandData, ['brands']))
        setCategories(normalizeList(categoryData, ['categories']))
      } catch (apiError) {
        if (isActive) setError(getApiErrorMessage(apiError, 'Unable to load filters.'))
      }
    }

    loadReferences()
    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    let isActive = true

    const loadWatches = async () => {
      setIsLoading(true)
      setError('')
      try {
        const payload = await storefrontApi.getWatches(filters)
        if (!isActive) return
        setPagination(normalizePagination(payload))
        setWatches(normalizeList(payload, ['watches']))
      } catch (apiError) {
        if (isActive) setError(getApiErrorMessage(apiError, 'Unable to load watches.'))
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    loadWatches()
    return () => {
      isActive = false
    }
  }, [filters])

  const updateFilter = (name, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(name, value)
    } else {
      next.delete(name)
    }
    if (name !== 'page') next.set('page', '1')
    setSearchParams(next)
  }

  return {
    brands,
    categories,
    error,
    filters,
    isLoading,
    pagination,
    updateFilter,
    watches,
  }
}
