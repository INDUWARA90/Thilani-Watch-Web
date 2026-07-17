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
  const [isUpdatingId, setIsUpdatingId] = useState(null)

  const loadReviews = async () => {
    setError('')
    try {
      const payload = await adminApi.getReviews()
      setReviews(normalizeList(payload, ['reviews']))
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load reviews.'))
    }
  }

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      setIsLoading(true)
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
    const reviewId = getId(review)
    setMessage('')
    setError('')
    setIsUpdatingId(reviewId)
    
    try {
      await adminApi.toggleReviewApproval(reviewId)
      setMessage(`Review status changed successfully.`)
      await loadReviews()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to update review approval.'))
    } finally {
      setIsUpdatingId(null)
    }
  }

  return (
    <div className="w-full flex flex-col text-sm">
      {/* Header Area */}
      <div className="mb-6">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-teal-600">Moderation Desk</p>
        <h2 className="m-0 text-2xl font-bold tracking-tight text-slate-900">Customer Reviews</h2>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 text-xs font-semibold text-rose-800 shadow-sm">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs font-semibold text-emerald-800 shadow-sm">
          {message}
        </div>
      )}

      {/* Data Section */}
      {isLoading ? (
        <LoadingState label="Loading review moderation" variant="reviews" rows={4} />
      ) : (
        <div className="flex flex-col gap-3.5">
          {reviews.map((review) => {
            const reviewId = getId(review)
            const isApproved = review.isApproved !== false
            const isPendingThisAction = isUpdatingId === reviewId
            const reviewedWatch = getReviewWatch(review)

            return (
              <article 
                className={`flex flex-col sm:flex-row justify-between gap-4 p-4 rounded-xl border bg-white transition-all ${
                  isApproved ? 'border-slate-200/80' : 'border-amber-200 bg-amber-50/20'
                } ${isPendingThisAction ? 'opacity-60 pointer-events-none' : ''}`} 
                key={reviewId}
              >
                <div className="flex flex-col gap-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {review.title || `Untitled Review`}
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-xs font-semibold text-slate-700">
                      ★ {review.rating || 0}/5
                    </span>
                  </div>
                  
                  <p className="text-slate-600 text-[13px] leading-relaxed m-0">
                    {review.comment || <em className="text-slate-400">No comment text provided.</em>}
                  </p>
                  <div className="mt-1.5 inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                    <span className="text-slate-400">Watch:</span>
                    <span className="text-slate-800">{reviewedWatch}</span>
                  </div>
                  
                  <span className="text-xs text-slate-400 mt-0.5">
                    By <span className="font-medium text-slate-500">{getTitle(review.user, 'Customer')}</span> • {formatDate(review.createdAt)}
                  </span>
                </div>

                {/* Control Column */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide ${
                    isApproved 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {isApproved ? 'Visible' : 'Hidden'}
                  </span>
                  
                  <button 
                    className={`inline-flex h-8 items-center justify-center rounded-lg border px-3 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      isApproved
                        ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                        : 'border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100/70'
                    }`} 
                    type="button" 
                    onClick={() => toggleApproval(review)}
                  >
                    {isApproved ? 'Hide Review' : 'Approve & Show'}
                  </button>
                </div>
              </article>
            )
          })}

          {reviews.length === 0 && (
            <div className="rounded-xl border border-slate-200 border-dashed p-8 text-center text-slate-400 font-medium">
              No product reviews require current moderation.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const getReviewWatch = (review) => {
  const watch = review.watch || review.product || review.watchId || review.productId

  if (!watch) return 'Watch not attached'
  if (typeof watch === 'string') return watch

  return getTitle(watch, 'Untitled watch')
}
