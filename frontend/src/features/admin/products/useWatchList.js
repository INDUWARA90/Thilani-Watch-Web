import { useCallback, useEffect, useState } from 'react'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { normalizeList, readBoolean } from '../lib/adminUtils'

export const useWatchList = (filters, setError) => {
  const [isLoading, setIsLoading] = useState(true)
  const [watches, setWatches] = useState([])

  const loadWatches = useCallback(async () => {
    setError('')
    setIsLoading(true)
    try {
      const payload = await adminApi.getWatches({ ...filters, limit: 100 })
      setWatches(normalizeList(payload, ['watches']))
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load watches.'))
    } finally {
      setIsLoading(false)
    }
  }, [filters, setError])

  useEffect(() => {
    // Delay the first load one tick so React hook lint accepts the state updates.
    const timer = setTimeout(loadWatches, 0)
    return () => clearTimeout(timer)
  }, [loadWatches])

  let visibleWatches = watches
  if (filters.published !== '') {
    visibleWatches = watches.filter((watch) => Boolean(watch.isPublished) === readBoolean(filters.published))
  }

  return { isLoading, loadWatches, visibleWatches }
}
