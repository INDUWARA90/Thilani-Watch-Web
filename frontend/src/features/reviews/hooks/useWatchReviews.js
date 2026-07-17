import { useCallback, useEffect, useState } from 'react'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { getId } from '@/features/storefront/lib/storefrontUtils'
import { reviewsApi } from '@/features/reviews/api/reviewsApi'
import { getReviewId, getReviewUserId, normalizeReviews } from '@/features/reviews/lib/reviewUtils'

const emptyForm = { comment: '', rating: 5, title: '' }

export const useWatchReviews = ({ onReviewsChanged, user, watchId }) => {
  const [editingReviewId, setEditingReviewId] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [reviews, setReviews] = useState([])

  const userId = getId(user)
  const myReview = reviews.find((review) => userId && getReviewUserId(review) === userId)

  const loadReviews = useCallback(async () => {
    if (!watchId) return

    setIsLoading(true)
    try {
      const payload = await reviewsApi.getWatchReviews(watchId)
      setReviews(normalizeReviews(payload))
      setError('')
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load reviews.'))
    } finally {
      setIsLoading(false)
    }
  }, [watchId])

  useEffect(() => {
    // Delay the first load one tick so React hook lint accepts the state updates.
    const timer = setTimeout(loadReviews, 0)
    return () => clearTimeout(timer)
  }, [loadReviews])

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
    setIsSubmitting(true)

    try {
      const payload = buildReviewPayload(form)
      if (editingReviewId) {
        await reviewsApi.updateReview(editingReviewId, payload)
        setMessage('Review updated successfully.')
      } else {
        await reviewsApi.createReview(watchId, payload)
        setMessage('Review submitted successfully.')
      }
      resetForm()
      await loadReviews()
      await onReviewsChanged?.()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to save review. You may already have a review for this watch.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteReview = async (review) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return

    setError('')
    setMessage('')
    try {
      await reviewsApi.deleteReview(getReviewId(review))
      setMessage('Review deleted.')
      resetForm()
      await loadReviews()
      await onReviewsChanged?.()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to delete review.'))
    }
  }

  return {
    deleteReview,
    editingReviewId,
    error,
    form,
    isLoading,
    isSubmitting,
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
