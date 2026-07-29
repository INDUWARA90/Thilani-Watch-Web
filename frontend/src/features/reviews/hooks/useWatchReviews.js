import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { getId } from '@/features/storefront/lib/storefrontUtils'
import { reviewsApi } from '@/features/reviews/api/reviewsApi'
import { getReviewId, getReviewUserId, normalizeReviews } from '@/features/reviews/lib/reviewUtils'

const emptyForm = { comment: '', rating: 5, title: '' }

export const useWatchReviews = ({ onReviewsChanged, user, watchId }) => {
  const [editingReviewId, setEditingReviewId] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState('')
  const queryClient = useQueryClient()
  const reviewsQuery = useQuery({
    enabled: Boolean(watchId),
    queryKey: ['reviews', 'watch', watchId],
    queryFn: () => reviewsApi.getWatchReviews(watchId),
    select: normalizeReviews,
  })
  const reviews = reviewsQuery.data ?? []

  const userId = getId(user)
  const myReview = reviews.find((review) => userId && getReviewUserId(review) === userId)
  const invalidateReviews = async () => {
    await queryClient.invalidateQueries({ queryKey: ['reviews', 'watch', watchId] })
    await onReviewsChanged?.()
  }
  const saveMutation = useMutation({
    mutationFn: ({ reviewId, payload }) => (
      reviewId ? reviewsApi.updateReview(reviewId, payload) : reviewsApi.createReview(watchId, payload)
    ),
    onSuccess: async (_data, { reviewId }) => {
      setMessage(reviewId ? 'Review updated successfully.' : 'Review submitted successfully.')
      resetForm()
      await invalidateReviews()
    },
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, 'Unable to save review. You may already have a review for this watch.'))
    },
  })
  const deleteMutation = useMutation({
    mutationFn: (review) => reviewsApi.deleteReview(getReviewId(review)),
    onSuccess: async () => {
      setMessage('Review deleted.')
      resetForm()
      await invalidateReviews()
    },
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, 'Unable to delete review.'))
    },
  })

  const resetForm = () => {
    setEditingReviewId('')
    setForm(emptyForm)
  }

  const startEdit = (review) => {
    setEditingReviewId(getReviewId(review))
    setForm({
      comment: review.comment || '',
      rating: Number(review.rating || 5),
      title: review.title || '',
    })
    setError('')
    setMessage('')
  }

  const saveReview = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    await saveMutation.mutateAsync({ reviewId: editingReviewId, payload: buildReviewPayload(form) })
  }

  const deleteReview = async (review) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return

    setError('')
    setMessage('')
    await deleteMutation.mutateAsync(review)
  }

  const loadError = reviewsQuery.error ? getApiErrorMessage(reviewsQuery.error, 'Unable to load reviews.') : ''

  return {
    deleteReview,
    editingReviewId,
    error: error || loadError,
    form,
    isLoading: reviewsQuery.isLoading,
    isSubmitting: saveMutation.isPending,
    message,
    myReview,
    resetForm,
    reviews,
    saveReview,
    setForm,
    startEdit,
    userId,
  }
}

const buildReviewPayload = (form) => {
  const payload = {
    comment: form.comment.trim(),
    rating: form.rating,
  }

  if (form.title.trim()) payload.title = form.title.trim()
  return payload
}
