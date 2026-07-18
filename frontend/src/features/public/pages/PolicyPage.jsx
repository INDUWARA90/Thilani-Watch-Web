import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { PolicyGrid } from '@/features/public/components/PolicyGrid'
import { PublicIntroPanel } from '@/features/public/components/PublicIntroPanel'
import { PublicPageShell } from '@/features/public/components/PublicPageShell'
import { policyItems } from '@/features/public/lib/staticPageContent'

export default function PolicyPage() {
  usePageTitle('Policy | Thilani Watch Web')

  return (
    <PublicPageShell
      eyebrow="Store policy"
      title="Simple policies for confident watch orders"
      text="Review how Thilani Watch Center handles product information, bank-transfer payment review, delivery, returns, and customer privacy."
    >
      <PublicIntroPanel kicker="Before checkout" title="Clear expectations for the current storefront flow">
        These policies match the current shopping experience: choose watches, checkout with delivery details, attach a bank-transfer slip, and wait for admin review.
      </PublicIntroPanel>
      <PolicyGrid items={policyItems} />
    </PublicPageShell>
  )
}

