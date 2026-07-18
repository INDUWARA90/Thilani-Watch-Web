import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { FaqAccordion } from '@/features/public/components/FaqAccordion'
import { PublicIntroPanel } from '@/features/public/components/PublicIntroPanel'
import { PublicPageShell, orangeButtonClass } from '@/features/public/components/PublicPageShell'
import { faqItems } from '@/features/public/lib/staticPageContent'

export default function FaqPage() {
  usePageTitle('FAQ | Thilani Watch Web')

  return (
    <PublicPageShell
      eyebrow="FAQ"
      title="Quick answers before you place an order"
      text="Understand payment slip upload, delivery timing, wishlist use, and how to contact Thilani Watch Center."
    >
      <PublicIntroPanel kicker="Customer support" title="The current checkout flow is bank transfer plus payment slip">
        These answers are focused on the live storefront flow, including when the slip uploads and how admins review payment.
      </PublicIntroPanel>
      <FaqAccordion items={faqItems} />
      <section className="mt-8 rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#FFF7ED_0%,#FFE1AD_100%)] p-6 text-[#121212] sm:flex sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#F59600]">Still unsure?</p>
          <h2 className="mt-2 text-2xl font-black">Talk to the shop before checkout</h2>
        </div>
        <Link className={`${orangeButtonClass} mt-5 sm:mt-0`} to="/contact">
          Contact support <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </PublicPageShell>
  )
}

