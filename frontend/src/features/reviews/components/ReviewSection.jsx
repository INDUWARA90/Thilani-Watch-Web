import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Star, MessageSquare, Trash2, Edit2, X } from 'lucide-react'
import { ButtonSpinner, LoadingState } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getId } from '@/features/storefront/lib/storefrontUtils'
import { reviewsApi } from '@/features/reviews/api/reviewsApi'
import { formatReviewDate, getReviewId, getReviewUserId, getReviewUserName, normalizeReviews } from '@/features/reviews/lib/reviewUtils'

const emptyForm = { comment: '', rating: 5, title: '' }

export const ReviewSection = ({ onReviewsChanged, watchId }) => {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const [reviews, setReviews] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingReviewId, setEditingReviewId] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const userId = getId(user)
  const myReview = useMemo(
    () => reviews.find((review) => userId && getReviewUserId(review) === userId),
    [reviews, userId],
  )

  const loadReviews = async () => {
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
  }

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      if (!watchId) return

      try {
        const payload = await reviewsApi.getWatchReviews(watchId)
        if (isMounted) {
          setReviews(normalizeReviews(payload))
          setError('')
        }
      } catch (apiError) {
        if (isMounted) {
          setError(getApiErrorMessage(apiError, 'Unable to load reviews.'))
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
  }, [watchId])

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

  const resetForm = () => {
    setEditingReviewId('')
    setForm(emptyForm)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    const payload = {
      comment: form.comment.trim(),
      rating: form.rating,
    }

    if (form.title.trim()) {
      payload.title = form.title.trim()
    }

    try {
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

  const handleDelete = async (review) => {
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

  return (
    <section className="mt-12">
      {/* Dynamic Headers */}
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-slate-100 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Verified Opinions</span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Customer Feedback</h2>
        </div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {reviews.length} Approved {reviews.length === 1 ? 'Review' : 'Reviews'}
        </span>
      </div>

      {/* Messaging Layout */}
      {error && <div className="mb-6 rounded-xl border border-red-100 bg-red-50/50 p-4 text-xs font-medium text-red-800 backdrop-blur-sm">{error}</div>}
      {message && <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-xs font-medium text-emerald-800 backdrop-blur-sm">{message}</div>}

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Reviews List Ledger */}
        <div className="flex flex-col gap-5">
          {isLoading ? (
            <LoadingState label="Fetching community logs" variant="reviews" rows={3} />
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard
                canManage={userId && getReviewUserId(review) === userId}
                key={getReviewId(review)}
                onDelete={handleDelete}
                onEdit={startEdit}
                review={review}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/30">
              <MessageSquare className="h-6 w-6 text-slate-300 mb-2" />
              <p className="text-xs font-medium text-slate-400">No approved comments posted for this model yet.</p>
            </div>
          )}
        </div>

        {/* Dynamic Interactive Management Panel Container */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 backdrop-blur-sm">
            {isAuthenticated ? (
              myReview && !editingReviewId ? (
                <div className="text-center py-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-700 mb-3">
                    <Star className="h-5 w-5 fill-amber-500" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-bold text-slate-900">Your review is live</h3>
                  <p className="mb-5 text-xs leading-relaxed text-slate-400">
                    To maintain dynamic accuracy, our server processes one review per client profile. You can edit your entry anytime.
                  </p>
                  <button 
                    className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-xs font-bold text-white transition hover:bg-amber-600" 
                    type="button" 
                    onClick={() => startEdit(myReview)}
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Modify Active Review
                  </button>
                </div>
              ) : (
                <ReviewForm
                  form={form}
                  isEditing={Boolean(editingReviewId)}
                  isSubmitting={isSubmitting}
                  onCancel={resetForm}
                  onChange={setForm}
                  onSubmit={handleSubmit}
                />
              )
            ) : (
              <div className="text-center py-6">
                <h3 className="mb-1.5 text-sm font-bold text-slate-900">Share Your Experience</h3>
                <p className="mb-5 text-xs leading-relaxed text-slate-400">
                  Logged in profiles can rate mechanical performance, fit, and build aesthetic.
                </p>
                <Link 
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-5 text-xs font-bold text-white no-underline transition hover:bg-amber-600" 
                  state={{ from: location }} 
                  to="/login"
                >
                  Log In to Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* --- Inline Visual Presentational Components --- */

const ReviewCard = ({ canManage, onDelete, onEdit, review }) => {
  const ratingValue = Number(review.rating || 0)

  return (
    <article className="rounded-2xl border border-slate-50 bg-white p-5 shadow-sm transition-shadow hover:shadow-md/5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">
            {review.title || `Rated ${ratingValue}/5`}
          </h4>
          <div className="mt-1.5 flex items-center gap-0.5">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`h-3.5 w-3.5 ${index < ratingValue ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`}
              />
            ))}
          </div>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          {formatReviewDate(review.createdAt)}
        </span>
      </div>
      
      <p className="mb-4 text-xs leading-relaxed text-slate-500">
        {review.comment}
      </p>
      
      <div className="flex items-center justify-between gap-4 border-t border-slate-50 pt-3">
        <span className="text-xs font-semibold text-slate-700">
          {getReviewUserName(review)}
        </span>
        
        {canManage && (
          <div className="flex items-center gap-1.5">
            <button 
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-100 bg-white text-slate-400 transition hover:border-slate-300 hover:text-slate-700" 
              type="button" 
              title="Edit entry"
              onClick={() => onEdit(review)}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button 
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-red-50/50 bg-red-50/30 text-red-400 transition hover:bg-red-50 hover:text-red-600" 
              type="button" 
              title="Delete entry"
              onClick={() => onDelete(review)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

const ReviewForm = ({ form, isEditing, isSubmitting, onCancel, onChange, onSubmit }) => {
  const [hoverRating, setHoverRating] = useState(0)
  
  const updateField = (name, value) => {
    onChange((current) => ({ ...current, [name]: value }))
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
        {isEditing ? 'Modify Review' : 'Compose Feedback'}
      </h3>
      
      {/* Elegant Star Strip Field Selector */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rating Selection</span>
        <div className="flex items-center gap-1 py-1">
          {[1, 2, 3, 4, 5].map((starValue) => {
            const isActive = hoverRating ? starValue <= hoverRating : starValue <= form.rating
            return (
              <button
                key={starValue}
                type="button"
                className="p-0.5 cursor-pointer text-slate-200 transition-transform active:scale-95 hover:scale-110"
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => updateField('rating', starValue)}
              >
                <Star className={`h-5 w-5 transition-colors ${isActive ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} />
              </button>
            )
          })}
        </div>
      </div>

      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
        Summary Header
        <input 
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15" 
          placeholder="e.g. Magnificent craftsmanship" 
          value={form.title} 
          onChange={(event) => updateField('title', event.target.value)} 
        />
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
        Detailed Review
        <textarea 
          className="min-h-24 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 resize-none" 
          placeholder="Share metrics about accuracy, comfort, weight..."
          required 
          value={form.comment} 
          onChange={(event) => updateField('comment', event.target.value)} 
        />
      </label>

      <div className="flex flex-col gap-2 mt-2">
        <button 
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-bold text-white transition hover:bg-amber-600 disabled:opacity-50" 
          disabled={isSubmitting} 
          type="submit"
        >
          {isSubmitting && <ButtonSpinner />} 
          {isSubmitting ? 'Processing...' : isEditing ? 'Update Post' : 'Publish Review'}
        </button>
        
        {isEditing && (
          <button 
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 transition hover:bg-slate-50" 
            type="button" 
            onClick={onCancel}
          >
            <X className="h-3.5 w-3.5" /> Discard Changes
          </button>
        )}
      </div>
    </form>
  )
}