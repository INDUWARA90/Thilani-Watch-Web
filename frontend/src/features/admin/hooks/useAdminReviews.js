import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { getId, normalizeList } from '../lib/adminUtils'

export const useAdminReviews = () => {
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const queryClient = useQueryClient()
  const reviewsQuery = useQuery({
    queryKey: ['admin', 'reviews'],
    queryFn: adminApi.getReviews,
    select: (payload) => normalizeList(payload, ['reviews']),
  })
  const toggleApprovalMutation = useMutation({
    mutationFn: adminApi.toggleReviewApproval,
    onMutate: (reviewId) => {
      setMessage('')
      setError('')
      setUpdatingId(reviewId)
    },
    onSuccess: async () => {
      setMessage('Review status changed successfully.')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
    },
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, 'Unable to update review approval.'))
    },
    onSettled: () => setUpdatingId(null),
  })

  const toggleApproval = async (review) => {
    const reviewId = getId(review)
    await toggleApprovalMutation.mutateAsync(reviewId)
  }

  const loadError = reviewsQuery.error ? getApiErrorMessage(reviewsQuery.error, 'Unable to load reviews.') : ''

  return {
    error: error || loadError,
    isLoading: reviewsQuery.isLoading,
    isUpdatingId: updatingId,
    message,
    reviews: reviewsQuery.data ?? [],
    toggleApproval,
  }
}
