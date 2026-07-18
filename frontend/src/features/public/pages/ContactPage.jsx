import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { ContactExperience } from '@/features/public/components/ContactExperience'
import { PublicIntroPanel } from '@/features/public/components/PublicIntroPanel'
import { PublicPageShell } from '@/features/public/components/PublicPageShell'
import { contactItems, socialItems } from '@/features/public/lib/staticPageContent'

export default function ContactPage() {
  usePageTitle('Contact Us | Thilani Watch Web')

  return (
    <PublicPageShell
      eyebrow="Contact us"
      title="Need help choosing or confirming a watch?"
      text="Reach Thilani Watch Center for product questions, payment slip support, delivery updates, and showroom directions."
    >
      <PublicIntroPanel kicker="Real shop details" title="Contact the team using phone, email, WhatsApp, Facebook, or showroom directions">
        Use these public contact details for order questions, watch availability, delivery timing, and payment confirmation support.
      </PublicIntroPanel>
      <ContactExperience contacts={contactItems} social={socialItems} />
    </PublicPageShell>
  )
}

