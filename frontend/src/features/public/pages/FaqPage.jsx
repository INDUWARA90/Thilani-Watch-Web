import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { FaqList } from '@/features/public/components/FaqList'
import { PublicPageIntro } from '@/features/public/components/PublicPageIntro'
import { StaticPageShell } from '@/features/public/components/StaticPageShell'
import { faqItems } from '@/features/public/lib/staticPageContent'

export const FaqPage = () => {
  usePageTitle('FAQ | Thilani Watch Web')

  return (
    <StaticPageShell eyebrow="FAQ" title="Questions customers ask often">
      <PublicPageIntro kicker="Quick answers" title="Helpful answers before customers place an order">
        This FAQ covers the current bank-transfer checkout flow, payment slip upload, delivery timing, wishlist usage, and shop contact options.
      </PublicPageIntro>
      <FaqList items={faqItems} />
    </StaticPageShell>
  )
}
