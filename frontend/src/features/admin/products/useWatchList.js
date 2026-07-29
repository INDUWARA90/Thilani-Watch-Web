import { useCallback, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { normalizeList, readBoolean } from '../lib/adminUtils'

export const useWatchList = (filters, setError) => {
  const query = useQuery({
    queryKey: ['admin', 'watches', filters],
    queryFn: () => adminApi.getWatches({ ...filters, limit: 100 }),
    select: (payload) => normalizeList(payload, ['watches']),
  })
  const loadWatches = useCallback(async () => {
    await query.refetch()
  }, [query])

  useEffect(() => {
    if (query.error) {
      setError(getApiErrorMessage(query.error, 'Unable to load watches.'))
    }
  }, [query.error, setError])

  let visibleWatches = query.data ?? []
  if (filters.published !== '') {
    visibleWatches = visibleWatches.filter((watch) => Boolean(watch.isPublished) === readBoolean(filters.published))
  }

  return { isLoading: query.isLoading, loadWatches, visibleWatches }
}
