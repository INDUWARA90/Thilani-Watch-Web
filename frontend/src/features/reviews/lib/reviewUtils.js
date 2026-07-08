import { getId, getTitle } from '@/features/storefront/lib/storefrontUtils'

export const normalizeReviews = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.reviews)) return payload.reviews
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

export const getReviewId = (review) => getId(review)

export const getReviewUserId = (review) => getId(review?.user)

export const getReviewUserName = (review) => getTitle(review?.user, 'Customer')

export const formatReviewDate = (value) => {
  if (!value) return ''

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
  }).format(new Date(value))
}
