import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Star, MessageSquare, Trash2, Edit2, X, CheckCircle2 } from 'lucide-react'
import { ButtonSpinner, LoadingState } from '@/shared/ui/LoadingState'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useWatchReviews } from '@/features/reviews/hooks/useWatchReviews'
import { formatReviewDate, getReviewId, getReviewUserId, getReviewUserName } from '@/features/reviews/lib/reviewUtils'

export const ReviewSection = ({ onReviewsChanged, watchId }) => {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const reviewState = useWatchReviews({ onReviewsChanged, user, watchId })

  return (
    <section className="mt-14 border-t border-primary/10 pt-6">
      {/* Header Bar */}
      <div className="mb-8 flex flex-col gap-3 border-b border-primary/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/15 bg-base px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
            <CheckCircle2 className="h-3 w-3 text-accent" /> Verified Owners
          </span>
          <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
            Customer Feedback
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary/70">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          {reviewState.reviews.length} Approved {reviewState.reviews.length === 1 ? 'Review' : 'Reviews'}
        </div>
      </div>

      {/* Notifications */}
      {reviewState.error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-medium text-red-300 backdrop-blur-sm">
          {reviewState.error}
        </div>
      )}
      {reviewState.message && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-300 backdrop-blur-sm">
          {reviewState.message}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Reviews List */}
        <div className="flex flex-col gap-4">
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
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/15 bg-card/50 p-10 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/5 text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-3 font-heading text-sm font-bold text-primary">No reviews yet</h3>
              <p className="mt-1 text-xs text-primary/70">Be the first to share details regarding fit, weight, and movement accuracy.</p>
            </div>
          )}
        </div>

        {/* Management Panel */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl border border-primary/10 bg-card p-6 shadow-premiumSm backdrop-blur-md">
            {isAuthenticated ? (
              reviewState.myReview && !reviewState.editingReviewId ? (
                <div className="py-2 text-center">
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Star className="h-6 w-6 fill-accent" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-primary">Your review is active</h3>
                  <p className="mt-2 text-xs leading-relaxed text-primary/75">
                    To maintain data integrity, clients may post one review per product. You can update your existing review at any time.
                  </p>
                  <button 
                    className="mt-5 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary text-xs font-bold text-accent shadow-premiumSm transition duration-200 hover:bg-accent hover:text-primary" 
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
              <div className="py-4 text-center">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-primary/5 text-accent">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-base font-bold text-primary">Share Your Opinion</h3>
                <p className="mt-2 text-xs leading-relaxed text-primary/75">
                  Sign in to rate mechanical build quality, wrist feel, and aesthetic design.
                </p>
                <Link 
                  className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary text-xs font-bold text-accent shadow-premiumSm transition duration-200 hover:bg-accent hover:text-primary" 
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

const ReviewCard = ({ canManage, onDelete, onEdit, review }) => {
  const ratingValue = Number(review.rating || 0)

  return (
    <article className="group rounded-xl border border-primary/10 bg-card p-6 shadow-premiumSm transition duration-200 hover:border-primary/25">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h4 className="font-heading text-base font-bold text-primary">
            {review.title || `Rated ${ratingValue}/5`}
          </h4>
          <div className="mt-1.5 flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`h-3.5 w-3.5 ${index < ratingValue ? 'fill-accent text-accent' : 'text-primary/20'}`}
              />
            ))}
          </div>
        </div>
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary/50">
          {formatReviewDate(review.createdAt)}
        </span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-primary/80 sm:text-sm">
        {review.comment}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-primary/10 pt-3">
        <span className="text-xs font-bold text-primary">
          {getReviewUserName(review)}
        </span>

        {canManage && (
          <div className="flex items-center gap-1.5">
            <button 
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-primary/10 bg-base text-primary/80 transition hover:border-accent hover:text-accent" 
              type="button" 
              title="Edit entry"
              onClick={() => onEdit(review)}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button 
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20" 
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
      <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-primary">
        {isEditing ? 'Modify Review' : 'Write a Review'}
      </h3>

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Rating Selection</span>
        <div className="flex items-center gap-1 py-1">
          {[1, 2, 3, 4, 5].map((starValue) => {
            const isActive = hoverRating ? starValue <= hoverRating : starValue <= form.rating
            return (
              <button
                key={starValue}
                type="button"
                className="cursor-pointer p-0.5 text-primary transition-transform active:scale-90 hover:scale-110"
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => updateField('rating', starValue)}
              >
                <Star className={`h-5 w-5 ${isActive ? 'fill-accent text-accent' : 'text-primary/25'}`} />
              </button>
            )
          })}
        </div>
      </div>

      <label className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary/60">
        Summary Header
        <input 
          className="h-10 rounded-lg border border-primary/10 bg-base px-3 text-xs font-medium text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent" 
          placeholder="e.g. Exceptional finish & automatic movement" 
          value={form.title} 
          onChange={(event) => updateField('title', event.target.value)} 
        />
      </label>

      <label className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary/60">
        Detailed Review
        <textarea 
          className="min-h-24 resize-none rounded-lg border border-primary/10 bg-base px-3 py-2.5 text-xs font-medium text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent" 
          placeholder="Share your thoughts on daily wearability, strap quality, etc."
          required 
          value={form.comment} 
          onChange={(event) => updateField('comment', event.target.value)} 
        />
      </label>

      <div className="mt-2 flex flex-col gap-2">
        <button 
          className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary text-xs font-bold text-accent shadow-premiumSm transition duration-200 hover:bg-accent hover:text-primary disabled:opacity-50" 
          disabled={isSubmitting} 
          type="submit"
        >
          {isSubmitting && <ButtonSpinner />} 
          {isSubmitting ? 'Processing...' : isEditing ? 'Update Review' : 'Publish Review'}
        </button>

        {isEditing && (
          <button 
            className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-primary/10 bg-base text-xs font-bold text-primary transition hover:bg-card" 
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