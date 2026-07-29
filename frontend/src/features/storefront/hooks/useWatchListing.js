import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { storefrontApi } from '@/features/storefront/api/storefrontApi'
import { normalizeList, normalizePagination } from '@/features/storefront/lib/storefrontUtils'

export const useWatchListing = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')

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

  const updateFilter = useCallback((name, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(name, value)
    } else {
      next.delete(name)
    }
    if (name !== 'page') next.set('page', '1')
    setSearchParams(next)
  }, [searchParams, setSearchParams])

  const resetFilters = useCallback(() => {
    setSearchValue('')
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  useEffect(() => {
    if (searchValue === filters.search) return undefined

    const timer = setTimeout(() => {
      updateFilter('search', searchValue)
    }, 450)

    return () => clearTimeout(timer)
  }, [filters.search, searchValue, updateFilter])

  const categoriesQuery = useQuery({
    queryKey: ['storefront', 'categories'],
    queryFn: storefrontApi.getCategories,
    select: (payload) => normalizeList(payload, ['categories']),
  })
  const brandsQuery = useQuery({
    queryKey: ['storefront', 'brands'],
    queryFn: storefrontApi.getBrands,
    select: (payload) => normalizeList(payload, ['brands']),
  })
  const watchesQuery = useQuery({
    queryKey: ['storefront', 'watches', filters],
    queryFn: () => storefrontApi.getWatches(filters),
  })

  const referenceError = categoriesQuery.error || brandsQuery.error
  const error = watchesQuery.error
    ? getApiErrorMessage(watchesQuery.error, 'Unable to load watches.')
    : referenceError
      ? getApiErrorMessage(referenceError, 'Unable to load filters.')
      : ''

  return {
    brands: brandsQuery.data ?? [],
    categories: categoriesQuery.data ?? [],
    error,
    filters,
    isLoading: watchesQuery.isLoading,
    pagination: normalizePagination(watchesQuery.data),
    searchValue,
    resetFilters,
    setSearchValue,
    updateFilter,
    watches: normalizeList(watchesQuery.data, ['watches']),
  }
}
