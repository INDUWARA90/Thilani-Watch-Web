import { Link } from 'react-router'
import { WatchCard } from './WatchCard'

export const WatchSection = ({ emptyText = 'No watches found yet.', title, watches }) => (
  <section className="py-8">
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      <Link className="font-bold text-teal-700 no-underline hover:underline" to="/watches">
        View all
      </Link>
    </div>
    {watches.length > 0 ? (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {watches.map((watch) => (
          <WatchCard key={watch._id || watch.id || watch.slug || watch.name} watch={watch} />
        ))}
      </div>
    ) : (
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-5 font-bold text-slate-600">{emptyText}</div>
    )}
  </section>
)
