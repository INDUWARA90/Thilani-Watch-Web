import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { PolicyList } from '@/features/public/components/PolicyList'
import { PublicPageIntro } from '@/features/public/components/PublicPageIntro'
import { StaticPageShell } from '@/features/public/components/StaticPageShell'
import { policyItems } from '@/features/public/lib/staticPageContent'

export const PolicyPage = () => {
  usePageTitle('Policy | Thilani Watch Web')

  return (
    <StaticPageShell eyebrow="Store policy" title="Clear rules for a confident order">
      <PublicPageIntro kicker="Before checkout" title="A simple policy page for customer trust">
        These policies are written for the current storefront flow. Customers can review payment, delivery, privacy, and return basics before placing an order.
      </PublicPageIntro>
      <PolicyList items={policyItems} />
    </StaticPageShell>
  )
}
