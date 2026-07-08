import { useEffect, useState } from 'react'
import { LoadingState } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { formatDate, getId, getTitle, normalizeList } from '../lib/adminUtils'

export const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadReviews = async () => {
    setError('')
    setIsLoading(true)
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
    let isMounted = true

    const run = async () => {
      try {
        const payload = await adminApi.getReviews()
        if (isMounted) {
          setReviews(normalizeList(payload, ['reviews']))
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
  }, [])

  const toggleApproval = async (review) => {
    setMessage('')
    try {
      await adminApi.toggleReviewApproval(getId(review))
      setMessage('Review approval updated.')
      await loadReviews()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to update review approval.'))
    }
  }

  return (
    <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(28,41,56,0.06)] sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-teal-700">Reviews</p>
          <h2 className="m-0 text-3xl font-bold leading-tight text-slate-950">Review moderation</h2>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}
      {message && <div className="rounded-lg border border-green-200 bg-green-50 px-3.5 py-3 font-bold text-green-800">{message}</div>}

      {isLoading ? (
        <LoadingState label="Loading review moderation" variant="reviews" rows={4} />
      ) : (
        <div className="grid gap-3">
          {reviews.map((review) => (
            <article className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row" key={getId(review)}>
              <div>
                <strong>{review.title || `${review.rating || 0}/5 review`}</strong>
                <p className="my-2 text-slate-700">{review.comment}</p>
                <span className="text-sm text-slate-500">
                  {getTitle(review.user, 'Customer')} - {formatDate(review.createdAt)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-extrabold ${review.isApproved !== false ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
                  {review.isApproved !== false ? 'Approved' : 'Hidden'}
                </span>
                <button className="inline-flex min-h-8 w-fit cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-extrabold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={() => toggleApproval(review)}>
                  Toggle approval
                </button>
              </div>
            </article>
          ))}
          {reviews.length === 0 && <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 font-bold text-emerald-950">No reviews found.</div>}
        </div>
      )}
    </div>
  )
}
