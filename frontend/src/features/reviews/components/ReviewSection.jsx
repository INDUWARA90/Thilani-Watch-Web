import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Star, MessageSquare, Trash2, Edit2, X } from 'lucide-react'
import { ButtonSpinner, LoadingState } from '@/shared/ui/LoadingState'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useWatchReviews } from '@/features/reviews/hooks/useWatchReviews'
import { formatReviewDate, getReviewId, getReviewUserId, getReviewUserName } from '@/features/reviews/lib/reviewUtils'

export const ReviewSection = ({ onReviewsChanged, watchId }) => {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const reviewState = useWatchReviews({ onReviewsChanged, user, watchId })

  return (
    <section className="mt-12">
      {/* Dynamic Headers */}
      <div className="mb-8 flex flex-col gap-2 border-b border-primary/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase text-primary/75">Verified Opinions</span>
          <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-primary">Customer Feedback</h2>
        </div>
        <span className="text-xs font-semibold uppercase text-primary/75">
          {reviewState.reviews.length} Approved {reviewState.reviews.length === 1 ? 'Review' : 'Reviews'}
        </span>
      </div>

      {/* Messaging Layout */}
      {reviewState.error && <div className="mb-6 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-xs font-medium text-red-200 backdrop-blur-sm">{reviewState.error}</div>}
      {reviewState.message && <div className="mb-6 rounded-lg border border-emerald-300/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-200 backdrop-blur-sm">{reviewState.message}</div>}

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Reviews List Ledger */}
        <div className="flex flex-col gap-5">
          {reviewState.isLoading ? (
            <LoadingState label="Fetching community logs" variant="reviews" rows={3} />
          ) : reviewState.reviews.length > 0 ? (
            reviewState.reviews.map((review) => (
              <ReviewCard
                canManage={reviewState.userId && getReviewUserId(review) === reviewState.userId}
                key={getReviewId(review)}
                onDelete={reviewState.deleteReview}
                onEdit={reviewState.startEdit}
                review={review}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-primary/10 bg-card p-8 text-center">
              <MessageSquare className="mb-2 h-6 w-6 text-primary/75" />
              <p className="text-xs font-medium text-primary/75">No approved comments posted for this model yet.</p>
            </div>
          )}
        </div>

        {/* Dynamic Interactive Management Panel Container */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-lg border border-primary/10 bg-card p-6 shadow-premiumSm backdrop-blur-sm">
            {isAuthenticated ? (
              reviewState.myReview && !reviewState.editingReviewId ? (
                <div className="text-center py-4">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary">
                    <Star className="h-5 w-5 fill-accent" />
                  </div>
                  <h3 className="mb-1.5 font-heading text-sm font-bold tracking-wide text-primary">Your review is live</h3>
                  <p className="mb-5 text-xs leading-relaxed text-primary/75">
                    To maintain dynamic accuracy, our server processes one review per client profile. You can edit your entry anytime.
                  </p>
                  <button 
                    className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-5 text-xs font-bold text-black transition hover:shadow-premiumSm" 
                    type="button" 
                    onClick={() => reviewState.startEdit(reviewState.myReview)}
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Modify Active Review
                  </button>
                </div>
              ) : (
                <ReviewForm
                  form={reviewState.form}
                  isEditing={Boolean(reviewState.editingReviewId)}
                  isSubmitting={reviewState.isSubmitting}
                  onCancel={reviewState.resetForm}
                  onChange={reviewState.setForm}
                  onSubmit={reviewState.saveReview}
                />
              )
            ) : (
              <div className="text-center py-6">
                <h3 className="mb-1.5 font-heading text-sm font-bold tracking-wide text-primary">Share Your Experience</h3>
                <p className="mb-5 text-xs leading-relaxed text-primary/75">
                  Logged in profiles can rate mechanical performance, fit, and build aesthetic.
                </p>
                <Link 
                  className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-xs font-bold text-black no-underline transition hover:shadow-premiumSm" 
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
    <article className="rounded-lg border border-primary/10 bg-card p-5 shadow-sm transition hover:border-primary/10 hover:shadow-premiumSm">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-primary">
            {review.title || `Rated ${ratingValue}/5`}
          </h4>
          <div className="mt-1.5 flex items-center gap-0.5">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`h-3.5 w-3.5 ${index < ratingValue ? 'fill-accent text-accent' : 'text-primary/35'}`}
              />
            ))}
          </div>
        </div>
        <span className="text-[11px] font-medium text-primary/75">
          {formatReviewDate(review.createdAt)}
        </span>
      </div>
      
      <p className="mb-4 text-xs leading-relaxed text-primary/75">
        {review.comment}
      </p>
      
      <div className="flex items-center justify-between gap-4 border-t border-primary/10 pt-3">
        <span className="text-xs font-semibold text-primary/75">
          {getReviewUserName(review)}
        </span>
        
        {canManage && (
          <div className="flex items-center gap-1.5">
            <button 
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-primary/10 bg-card text-primary/75 transition hover:border-primary/10 hover:text-accent" 
              type="button" 
              title="Edit entry"
              onClick={() => onEdit(review)}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button 
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-red-400/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/20" 
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
      <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-primary">
        {isEditing ? 'Modify Review' : 'Compose Feedback'}
      </h3>
      
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-bold uppercase text-primary/75">Rating Selection</span>
        <div className="flex items-center gap-1 py-1">
          {[1, 2, 3, 4, 5].map((starValue) => {
            const isActive = hoverRating ? starValue <= hoverRating : starValue <= form.rating
            return (
              <button
                key={starValue}
                type="button"
                className="cursor-pointer p-0.5 text-primary/35 transition-transform active:scale-95 hover:scale-110"
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => updateField('rating', starValue)}
              >
                <Star className={`h-5 w-5 transition-colors ${isActive ? 'fill-accent text-accent' : 'text-primary/35'}`} />
              </button>
            )
          })}
        </div>
      </div>

      <label className="flex flex-col gap-1.5 text-xs font-bold uppercase text-primary/75">
        Summary Header
        <input 
          className="h-10 rounded-lg border border-primary/10 bg-black/35 px-3 text-xs font-medium text-primary outline-none transition focus:border-primary/10 focus:ring-2 focus:ring-accent/30" 
          placeholder="e.g. Magnificent craftsmanship" 
          value={form.title} 
          onChange={(event) => updateField('title', event.target.value)} 
        />
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-bold uppercase text-primary/75">
        Detailed Review
        <textarea 
          className="min-h-24 resize-none rounded-lg border border-primary/10 bg-black/35 px-3 py-2.5 text-xs font-medium text-primary outline-none transition focus:border-primary/10 focus:ring-2 focus:ring-accent/30" 
          placeholder="Share metrics about accuracy, comfort, weight..."
          required 
          value={form.comment} 
          onChange={(event) => updateField('comment', event.target.value)} 
        />
      </label>

      <div className="mt-2 flex flex-col gap-2">
        <button 
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-white text-xs font-bold text-black transition hover:shadow-premiumSm disabled:opacity-50" 
          disabled={isSubmitting} 
          type="submit"
        >
          {isSubmitting && <ButtonSpinner />} 
          {isSubmitting ? 'Processing...' : isEditing ? 'Update Post' : 'Publish Review'}
        </button>
        
        {isEditing && (
          <button 
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-primary/10 bg-card text-xs font-bold text-primary transition hover:border-primary/10" 
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
