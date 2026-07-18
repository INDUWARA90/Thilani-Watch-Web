import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { ContactMethodGrid } from '@/features/public/components/ContactMethodGrid'
import { SocialPanel } from '@/features/public/components/SocialPanel'
import { StaticPageShell } from '@/features/public/components/StaticPageShell'
import { contactItems, socialItems } from '@/features/public/lib/staticPageContent'

export const ContactPage = () => {
  usePageTitle('Contact Us | Thilani Watch Web')

  return (
    <StaticPageShell eyebrow="Contact us" title="Talk to Thilani Watch Center">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <ContactMethodGrid items={contactItems} />
        <SocialPanel items={socialItems} />
      </section>
    </StaticPageShell>
  )
}
