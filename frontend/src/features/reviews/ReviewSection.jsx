import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { getApiErrorMessage } from '../../lib/apiClient'
import { useAuth } from '../auth/useAuth'
import { getId } from '../storefront/storefrontUtils'
import { reviewsApi } from './reviewsApi'
import { formatReviewDate, getReviewId, getReviewUserId, getReviewUserName, normalizeReviews } from './reviewUtils'

const emptyForm = { comment: '', rating: '5', title: '' }

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
      rating: String(review.rating || 5),
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
      rating: Number(form.rating),
    }

    if (form.title.trim()) {
      payload.title = form.title.trim()
    }

    try {
      if (editingReviewId) {
        await reviewsApi.updateReview(editingReviewId, payload)
        setMessage('Review updated.')
      } else {
        await reviewsApi.createReview(watchId, payload)
        setMessage('Review submitted.')
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
    <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(28,41,56,0.06)] lg:p-7">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-extrabold uppercase tracking-normal text-teal-700">Customer reviews</p>
          <h2 className="text-3xl font-bold leading-tight text-slate-950">Reviews</h2>
        </div>
        <span className="font-bold text-slate-600">{reviews.length} approved {reviews.length === 1 ? 'review' : 'reviews'}</span>
      </div>

      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}
      {message && <div className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 font-bold text-emerald-950">{message}</div>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-3">
          {isLoading ? (
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 font-bold text-emerald-950">Loading reviews...</div>
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
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-5 font-bold text-slate-600">No approved reviews yet.</div>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          {isAuthenticated ? (
            myReview && !editingReviewId ? (
              <div>
                <h3 className="mb-2 text-xl font-bold text-slate-950">You already reviewed this watch</h3>
                <p className="mb-4 text-slate-600">The backend allows one review per user. Edit or delete your existing review to change it.</p>
                <button className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg bg-teal-700 px-4 font-extrabold text-white hover:bg-teal-800" type="button" onClick={() => startEdit(myReview)}>
                  Edit your review
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
            <div>
              <h3 className="mb-2 text-xl font-bold text-slate-950">Log in to review</h3>
              <p className="mb-4 text-slate-600">Share your experience after signing in.</p>
              <Link className="inline-flex min-h-10 items-center justify-center rounded-lg bg-teal-700 px-4 font-extrabold text-white no-underline hover:bg-teal-800" state={{ from: location }} to="/login">
                Log in
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const ReviewCard = ({ canManage, onDelete, onEdit, review }) => (
  <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
    <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
      <div>
        <strong className="text-lg text-slate-950">{review.title || `${review.rating || 0}/5 review`}</strong>
        <div className="mt-1 text-sm font-bold text-amber-700">Rating {Number(review.rating || 0)}/5</div>
      </div>
      <span className="text-sm text-slate-500">{formatReviewDate(review.createdAt)}</span>
    </div>
    <p className="mb-3 leading-7 text-slate-700">{review.comment}</p>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm font-bold text-slate-500">{getReviewUserName(review)}</span>
      {canManage && (
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex min-h-9 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-extrabold text-slate-950 hover:bg-slate-50" type="button" onClick={() => onEdit(review)}>
            Edit
          </button>
          <button className="inline-flex min-h-9 cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-extrabold text-red-800 hover:bg-red-100" type="button" onClick={() => onDelete(review)}>
            Delete
          </button>
        </div>
      )}
    </div>
  </article>
)

const ReviewForm = ({ form, isEditing, isSubmitting, onCancel, onChange, onSubmit }) => {
  const updateField = (name, value) => {
    onChange((current) => ({ ...current, [name]: value }))
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <h3 className="text-xl font-bold text-slate-950">{isEditing ? 'Edit your review' : 'Write a review'}</h3>
      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Rating
        <select className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" value={form.rating} onChange={(event) => updateField('rating', event.target.value)}>
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Great</option>
          <option value="3">3 - Good</option>
          <option value="2">2 - Fair</option>
          <option value="1">1 - Poor</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Title
        <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" placeholder="Optional title" value={form.title} onChange={(event) => updateField('title', event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Comment
        <textarea className="min-h-28 min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" required value={form.comment} onChange={(event) => updateField('comment', event.target.value)} />
      </label>
      <div className="flex flex-wrap gap-2">
        <button className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg bg-teal-700 px-4 font-extrabold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-65" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Saving...' : isEditing ? 'Update review' : 'Submit review'}
        </button>
        {isEditing && (
          <button className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 font-extrabold text-slate-950 hover:bg-slate-50" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
