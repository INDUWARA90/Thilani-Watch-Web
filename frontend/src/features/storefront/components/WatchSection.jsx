import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { WatchCard } from './WatchCard'

export const WatchSection = ({ emptyText = 'No watches found yet.', title, watches }) => (
  <section className="mx-auto max-w-[1200px] py-16">
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-sm font-normal text-[#F49006]">Curated edit</p>
        <h2 className="text-[34px] font-bold leading-tight text-[#121212] sm:text-[50px] sm:leading-[48px]">{title}</h2>
      </div>
      <Link className="inline-flex min-h-11 items-center gap-2 rounded-[14px] border border-[#DEE2E6] bg-[rgba(18,18,18,0.04)] px-8 text-sm font-normal text-[#121212] no-underline transition hover:border-[#A7A7A7] hover:bg-[rgba(18,18,18,0.08)]" to="/watches">
        View all <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
    {watches.length > 0 ? (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {watches.map((watch) => (
          <WatchCard key={watch._id || watch.id || watch.slug || watch.name} watch={watch} />
        ))}
      </div>
    ) : (
      <div className="border border-dashed border-[#DEE2E6] bg-[#F8F9FA] px-5 py-8 text-center font-normal text-[#6C757D]">{emptyText}</div>
    )}
  </section>
)
