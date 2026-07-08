import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { WatchCard } from './WatchCard'

export const WatchSection = ({ emptyText = 'No watches found yet.', title, watches }) => (
  <section className="py-10">
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[#8f6f10]">Curated edit</p>
        <h2 className="text-2xl font-black text-slate-950 sm:text-3xl">{title}</h2>
      </div>
      <Link className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold text-slate-950 no-underline shadow-sm transition hover:border-[#D4AF37] hover:text-[#8f6f10]" to="/watches">
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
      <div className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-8 text-center font-bold text-slate-600">{emptyText}</div>
    )}
  </section>
)
