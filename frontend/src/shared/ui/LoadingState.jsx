import { LoaderCircle } from 'lucide-react'

// Enhanced darker translucent pulse template for glassmorphism panels
const shimmer = 'animate-pulse bg-gradient-to-r from-white/5 via-white/20 to-white/5 rounded-[6px]'

export const LoadingState = ({ label = 'Loading', variant = 'panel', rows = 3 }) => {
  if (variant === 'page') return <PageLoader label={label} />
  if (variant === 'cards') return <CardSkeleton count={rows} />
  if (variant === 'detail') return <DetailSkeleton />
  if (variant === 'form') return <FormSkeleton />
  if (variant === 'reviews') return <ReviewSkeleton count={rows} />
  if (variant === 'table') return <TableSkeleton rows={rows} />

  // Neutral Modern Panel Loading Component
  return (
    <div className="relative mx-auto max-w-[400px] overflow-hidden rounded-[20px] border border-slate-100 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-orange-100 bg-orange-50 text-[#F49006]">
          <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-medium text-slate-400">Please wait</p>
          <p className="font-bold tracking-tight text-slate-900">{label}</p>
        </div>
      </div>
    </div>
  )
}

export const ButtonSpinner = () => <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />

export const PageLoader = ({ label = 'Loading page' }) => (
  <div className="grid min-h-[calc(100vh-180px)] w-full place-items-center px-4 py-12">
    <div className="relative w-full max-w-[340px] overflow-hidden rounded-[22px] border border-orange-100 bg-white p-6 text-center shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F49006] via-[#121212] to-[#EB960E]" />
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-orange-50 text-[#F49006] ring-8 ring-orange-50/50">
        <LoaderCircle className="h-8 w-8 animate-spin" aria-hidden="true" />
      </span>
      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">Please wait</p>
      <p className="mt-1 text-base font-bold text-slate-900">{label}</p>
      <div className="mx-auto mt-5 h-1.5 w-32 overflow-hidden rounded-full bg-slate-100">
        <span className="block h-full w-1/2 animate-pulse rounded-full bg-[#F49006]" />
      </div>
    </div>
  </div>
)

export const CardSkeleton = ({ count = 6 }) => (
  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <article className="overflow-hidden rounded-[24px] border border-white/20 bg-white/10 p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] backdrop-blur-sm" key={index}>
        <div className={`${shimmer} aspect-[4/3] w-full rounded-[14px]`} />
        <div className="grid gap-3 pt-4 px-1">
          <div className={`${shimmer} h-3 w-1/3`} />
          <div className={`${shimmer} h-5 w-4/5`} />
          <div className={`${shimmer} h-4 w-full`} />
          <div className={`${shimmer} h-4 w-2/3`} />
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div className={`${shimmer} h-10 rounded-[10px]`} />
            <div className={`${shimmer} h-10 rounded-[10px]`} />
          </div>
        </div>
      </article>
    ))}
  </div>
)

export const DetailSkeleton = () => (
  <section className="grid gap-8 rounded-[24px] border border-white/20 bg-white/10 p-5 sm:p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] backdrop-blur-sm lg:grid-cols-[minmax(0,1fr)_440px]">
    <div>
      <div className={`${shimmer} aspect-[4/3] w-full rounded-[16px]`} />
      <div className="mt-3 grid grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, index) => <div className={`${shimmer} aspect-square rounded-[8px]`} key={index} />)}
      </div>
    </div>
    <div className="grid content-start gap-4">
      <div className={`${shimmer} h-4 w-1/2`} />
      <div className={`${shimmer} h-12 w-full`} />
      <div className={`${shimmer} h-5 w-5/6`} />
      <div className={`${shimmer} h-9 w-1/2`} />
      <div className={`${shimmer} h-28 w-full`} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className={`${shimmer} h-16 rounded-[10px]`} />
        <div className={`${shimmer} h-16 rounded-[10px]`} />
        <div className={`${shimmer} h-16 rounded-[10px]`} />
        <div className={`${shimmer} h-16 rounded-[10px]`} />
      </div>
    </div>
  </section>
)

export const FormSkeleton = () => (
  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
    <div className="grid gap-5">
      {Array.from({ length: 3 }).map((_, index) => (
        <section className="rounded-[24px] border border-white/20 bg-white/10 p-5 sm:p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] backdrop-blur-sm" key={index}>
          <div className={`${shimmer} mb-5 h-6 w-1/3`} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`${shimmer} h-12 rounded-[10px]`} />
            <div className={`${shimmer} h-12 rounded-[10px]`} />
            <div className={`${shimmer} h-12 rounded-[10px]`} />
            <div className={`${shimmer} h-12 rounded-[10px]`} />
          </div>
        </section>
      ))}
    </div>
    <aside className="h-fit rounded-[24px] border border-white/20 bg-white/10 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] backdrop-blur-sm">
      <div className={`${shimmer} mb-5 h-6 w-1/2`} />
      <div className="grid gap-3">
        <div className={`${shimmer} h-5`} />
        <div className={`${shimmer} h-5`} />
        <div className={`${shimmer} h-5`} />
        <div className={`${shimmer} mt-3 h-12 rounded-[12px]`} />
      </div>
    </aside>
  </div>
)

export const ReviewSkeleton = ({ count = 3 }) => (
  <div className="grid gap-3">
    {Array.from({ length: count }).map((_, index) => (
      <article className="rounded-[16px] border border-white/10 bg-black/10 p-4" key={index}>
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
  <div className="w-full overflow-x-auto rounded-[24px] border border-white/20 bg-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] backdrop-blur-sm">
    <div className="min-w-[720px]">
      <div className="grid grid-cols-5 gap-4 border-b border-white/10 p-4">
        {Array.from({ length: 5 }).map((_, index) => <div className={`${shimmer} h-4`} key={index} />)}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div className="grid grid-cols-5 gap-4 border-b border-white/5 p-4 last:border-b-0" key={row}>
          {Array.from({ length: 5 }).map((_, cell) => <div className={`${shimmer} h-5`} key={cell} />)}
        </div>
      ))}
    </div>
  </div>
)
