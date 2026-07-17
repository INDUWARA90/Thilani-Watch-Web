import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { CardSkeleton } from '@/shared/ui/LoadingState'
import { WatchCard } from '@/features/storefront/components/WatchCard'
import { getId } from '@/features/storefront/lib/storefrontUtils'

export const HomeWatchSection = ({ eyebrow, title, text, watches, isLoading }) => (
  <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-10">
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#F49006]">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-[#121212] sm:text-4xl">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-[#6C757D] sm:text-base">{text}</p>
      </div>
      <Link
        className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-[14px] border border-[#DEE2E6] bg-white px-5 text-sm font-semibold text-[#121212] no-underline transition hover:border-[#F49006] hover:text-[#F49006]"
        to="/watches"
      >
        View all <ArrowRight className="h-4 w-4" />
      </Link>
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
      <div className="rounded-[18px] border border-dashed border-[#DEE2E6] bg-white px-5 py-12 text-center">
        <p className="text-lg font-black text-[#121212]">No watches here yet</p>
        <p className="mt-2 text-sm text-[#6C757D]">This section will fill automatically when matching watches are added.</p>
      </div>
    )}
  </section>
)
