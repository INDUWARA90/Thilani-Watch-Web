import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { AboutBrandSection } from '@/features/public/components/AboutBrandSection'
import { AboutHighlights } from '@/features/public/components/AboutHighlights'
import { PublicPageShell } from '@/features/public/components/PublicPageShell'
import { TrustStatStrip } from '@/features/public/components/TrustStatStrip'
import { aboutHighlights, aboutSteps, trustStats } from '@/features/public/lib/staticPageContent'

export default function AboutPage() {
  usePageTitle('About Us | Thilani Watch Web')

  return (
    <PublicPageShell
      eyebrow="About us"
      title="A trusted local watch experience from Moratuwa"
      text="Thilani Watch Center brings premium watches, clear checkout, bank-transfer proof, and order tracking together for Sri Lankan customers."
    >
      <TrustStatStrip stats={trustStats} />
      <AboutBrandSection />
      <AboutHighlights items={aboutHighlights} steps={aboutSteps} />
    </PublicPageShell>
  )
}

