import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { CardSkeleton } from '@/shared/ui/LoadingState'
import { WatchCard } from '@/features/storefront/components/WatchCard'
import { getId } from '@/features/storefront/lib/storefrontUtils'

export const HomeWatchSection = ({ eyebrow, title, text, watches, isLoading }) => (
  <motion.section
    className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-10"
    initial={{ opacity: 0, y: 24 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    viewport={{ once: true, margin: '-80px' }}
    whileInView={{ opacity: 1, y: 0 }}
  >
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="inline-flex min-h-8 items-center rounded-full border border-white/15 bg-white/5 px-3 text-xs font-semibold uppercase text-white/70">{eyebrow}</p>
        <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-white/70 sm:text-base">{text}</p>
      </div>
      <motion.div whileHover={{ scale: 1.03 }}>
        <Link
          className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-sm font-bold text-white no-underline transition hover:border-white/45 hover:shadow-glowSm"
          to="/watches"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>

    {isLoading ? (
      <CardSkeleton count={3} />
    ) : watches.length > 0 ? (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {watches.slice(0, 3).map((watch) => (
          <WatchCard key={getId(watch)} watch={watch} />
        ))}
      </div>
    ) : (
      <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-5 py-12 text-center">
        <p className="font-heading text-lg font-bold text-white">No watches here yet</p>
        <p className="mt-2 text-sm text-white/65">This section will fill automatically when matching watches are added.</p>
      </div>
    )}
  </motion.section>
)
