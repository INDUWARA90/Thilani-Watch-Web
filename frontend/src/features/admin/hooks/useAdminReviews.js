import { useEffect, useState } from 'react'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { getId, normalizeList } from '../lib/adminUtils'

export const useAdminReviews = () => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdatingId, setIsUpdatingId] = useState(null)
  const [message, setMessage] = useState('')
  const [reviews, setReviews] = useState([])

  const loadReviews = async () => {
    setError('')
    try {
      const payload = await adminApi.getReviews()
      setReviews(normalizeList(payload, ['reviews']))
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load reviews.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(loadReviews, 0)
    return () => clearTimeout(timer)
  }, [])

  const toggleApproval = async (review) => {
    const reviewId = getId(review)
    setMessage('')
    setError('')
    setIsUpdatingId(reviewId)

    try {
      await adminApi.toggleReviewApproval(reviewId)
      setMessage('Review status changed successfully.')
      await loadReviews()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to update review approval.'))
    } finally {
      setIsUpdatingId(null)
    }
  }

  return { error, isLoading, isUpdatingId, message, reviews, toggleApproval }
}
