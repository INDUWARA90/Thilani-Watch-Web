import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { CardSkeleton } from '@/shared/ui/LoadingState'
import { WatchCard } from '@/features/storefront/components/WatchCard'
import { getId } from '@/features/storefront/lib/storefrontUtils'

export const HomeWatchSection = ({ eyebrow, title, text, watches, isLoading }) => (
  <motion.section
    className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6 sm:py-28 lg:px-10"
    initial={{ opacity: 0, y: 24 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    viewport={{ once: true, margin: '-80px' }}
    whileInView={{ opacity: 1, y: 0 }}
  >
    <div className="mb-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
 <p className="inline-flex min-h-8 items-center border-b border-accent/60 px-0 pb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary/70">{eyebrow}</p>
        <div className="mt-5 h-px w-20 bg-accent" aria-hidden="true" />
        <h2 className="mt-5 font-heading text-4xl font-bold leading-none tracking-wide text-primary sm:text-6xl">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-black">{text}</p>
      </div>
      <motion.div whileHover={{ scale: 1.03 }}>
        <Link
          className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border border-accent/40 bg-card px-6 text-sm font-bold text-primary no-underline shadow-premiumSm transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-goldHairline focus:outline-none focus:ring-2 focus:ring-accent"
          to="/watches"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>

    {isLoading ? (
      <CardSkeleton count={3} />
    ) : watches.length > 0 ? (
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.18fr_0.91fr_0.91fr] lg:items-start">
        {watches.slice(0, 3).map((watch, index) => (
          <div className={index === 0 ? 'lg:-mt-4' : ''} key={getId(watch)}>
            <WatchCard watch={watch} />
          </div>
        ))}
      </div>
    ) : (
      <div className="rounded-lg border border-dashed border-primary/15 bg-card px-5 py-12 text-center shadow-premiumSm">
        <p className="font-heading text-lg font-bold text-primary">No watches here yet</p>
        <p className="mt-2 text-sm text-primary/75">This section will fill automatically when matching watches are added.</p>
      </div>
    )}
  </motion.section>
)
