import { LoaderCircle } from 'lucide-react'

const shimmer = 'animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100'

export const LoadingState = ({ label = 'Loading', variant = 'panel', rows = 3 }) => {
  if (variant === 'cards') return <CardSkeleton count={rows} />
  if (variant === 'detail') return <DetailSkeleton />
  if (variant === 'form') return <FormSkeleton />
  if (variant === 'reviews') return <ReviewSkeleton count={rows} />
  if (variant === 'table') return <TableSkeleton rows={rows} />

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-slate-950 text-[#D4AF37]">
          <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#8f6f10]">Please wait</p>
          <p className="font-black text-slate-950">{label}</p>
        </div>
      </div>
    </div>
  )
}

export const ButtonSpinner = () => <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />

export const CardSkeleton = ({ count = 6 }) => (
  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm" key={index}>
        <div className={`${shimmer} aspect-[4/3] w-full rounded-none`} />
        <div className="grid gap-3 p-4">
          <div className={`${shimmer} h-3 w-1/3`} />
          <div className={`${shimmer} h-5 w-4/5`} />
          <div className={`${shimmer} h-4 w-full`} />
          <div className={`${shimmer} h-4 w-2/3`} />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className={`${shimmer} h-10`} />
            <div className={`${shimmer} h-10`} />
          </div>
        </div>
      </article>
    ))}
  </div>
)

export const DetailSkeleton = () => (
  <section className="grid gap-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_440px]">
    <div>
      <div className={`${shimmer} aspect-[4/3] w-full`} />
      <div className="mt-3 grid grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, index) => <div className={`${shimmer} aspect-square`} key={index} />)}
      </div>
    </div>
    <div className="grid content-start gap-4">
      <div className={`${shimmer} h-4 w-1/2`} />
      <div className={`${shimmer} h-12 w-full`} />
      <div className={`${shimmer} h-5 w-5/6`} />
      <div className={`${shimmer} h-9 w-1/2`} />
      <div className={`${shimmer} h-28 w-full`} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className={`${shimmer} h-16`} />
        <div className={`${shimmer} h-16`} />
        <div className={`${shimmer} h-16`} />
        <div className={`${shimmer} h-16`} />
      </div>
    </div>
  </section>
)

export const FormSkeleton = () => (
  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
    <div className="grid gap-5">
      {Array.from({ length: 3 }).map((_, index) => (
        <section className="rounded-lg border border-slate-200 bg-white p-5" key={index}>
          <div className={`${shimmer} mb-5 h-6 w-1/3`} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`${shimmer} h-12`} />
            <div className={`${shimmer} h-12`} />
            <div className={`${shimmer} h-12`} />
            <div className={`${shimmer} h-12`} />
          </div>
        </section>
      ))}
    </div>
    <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5">
      <div className={`${shimmer} mb-5 h-6 w-1/2`} />
      <div className="grid gap-3">
        <div className={`${shimmer} h-5`} />
        <div className={`${shimmer} h-5`} />
        <div className={`${shimmer} h-5`} />
        <div className={`${shimmer} mt-3 h-11`} />
      </div>
    </aside>
  </div>
)

export const ReviewSkeleton = ({ count = 3 }) => (
  <div className="grid gap-3">
    {Array.from({ length: count }).map((_, index) => (
      <article className="rounded-lg border border-slate-200 bg-slate-50 p-4" key={index}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className={`${shimmer} h-5 w-1/2`} />
          <div className={`${shimmer} h-4 w-24`} />
        </div>
        <div className={`${shimmer} mb-2 h-4 w-full`} />
        <div className={`${shimmer} h-4 w-4/5`} />
      </article>
    ))}
  </div>
)

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white">
    <div className="min-w-[720px]">
      <div className="grid grid-cols-5 gap-4 border-b border-slate-200 p-4">
        {Array.from({ length: 5 }).map((_, index) => <div className={`${shimmer} h-4`} key={index} />)}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div className="grid grid-cols-5 gap-4 border-b border-slate-100 p-4 last:border-b-0" key={row}>
          {Array.from({ length: 5 }).map((_, cell) => <div className={`${shimmer} h-5`} key={cell} />)}
        </div>
      ))}
    </div>
  </div>
)
