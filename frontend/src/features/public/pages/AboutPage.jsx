import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { AboutIntro } from '@/features/public/components/AboutIntro'
import { AboutValueGrid } from '@/features/public/components/AboutValueGrid'
import { StaticPageShell } from '@/features/public/components/StaticPageShell'
import { aboutValues } from '@/features/public/lib/staticPageContent'

export const AboutPage = () => {
  usePageTitle('About Us | Thilani Watch Web')

  return (
    <StaticPageShell eyebrow="About us" title="Thilani Watch Center">
      <AboutIntro />
      <AboutValueGrid items={aboutValues} />
    </StaticPageShell>
  )
}
