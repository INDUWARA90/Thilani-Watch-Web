import { useEffect, useMemo, useState } from 'react'
import { getApiErrorMessage } from '../../../lib/apiClient'
import { adminApi } from '../adminApi'
import { normalizeList, readBoolean } from '../adminUtils'

export const useWatchList = (filters, setError) => {
  const [watches, setWatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadWatches = async () => {
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
  }

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        const payload = await adminApi.getWatches({ ...filters, limit: 100 })
        if (isMounted) {
          setWatches(normalizeList(payload, ['watches']))
          setError('')
        }
      } catch (apiError) {
        if (isMounted) {
          setError(getApiErrorMessage(apiError, 'Unable to load watches.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [filters, setError])

  const visibleWatches = useMemo(() => {
    if (filters.published === '') return watches
    return watches.filter((watch) => Boolean(watch.isPublished) === readBoolean(filters.published))
  }, [filters.published, watches])

  return { isLoading, loadWatches, visibleWatches }
}
