import { useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { normalizeList, readBoolean } from '../lib/adminUtils'

export const useWatchList = (filters, setError) => {
  const queryClient = useQueryClient()

  const loadWatches = async () => {
    setError('')
    try {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'watches'] })
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load watches.'))
    }
  }

  const watchQuery = useQuery({
    queryFn: async () => {
      const payload = await adminApi.getWatches({ ...filters, limit: 100 })
      return normalizeList(payload, ['watches'])
    },
    queryKey: ['admin', 'watches', filters],
  })

  useEffect(() => {
    setError(watchQuery.error ? getApiErrorMessage(watchQuery.error, 'Unable to load watches.') : '')
  }, [setError, watchQuery.error])

  const visibleWatches = useMemo(() => {
    const watches = watchQuery.data || []
    if (filters.published === '') return watches
    return watches.filter((watch) => Boolean(watch.isPublished) === readBoolean(filters.published))
  }, [filters.published, watchQuery.data])

  return { isLoading: watchQuery.isLoading, loadWatches, visibleWatches }
}
