import { Link } from 'react-router'
import { ArrowRight, HelpCircle } from 'lucide-react'
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

      <div className="mt-8">
        <FaqAccordion items={faqItems} />
      </div>

      {/* Enhanced Call-to-Action Banner */}
      <section className="mt-10 overflow-hidden rounded-xl border border-primary/10 bg-card p-6 text-black shadow-premiumSm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/5 text-accent shadow-sm">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/15 bg-base px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black">
                Need More Assistance?
              </span>
              <h2 className="mt-2 font-heading text-xl font-extrabold tracking-tight sm:text-2xl">
                Talk to the shop before checkout
              </h2>
              <p className="mt-1 text-xs text-primary/75">
                Our support team is on hand to clarify any questions regarding availability or orders.
              </p>
            </div>
          </div>

          <Link className={`${orangeButtonClass} shrink-0 items-center gap-2`} to="/contact">
            Contact support <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PublicPageShell>
  )
}