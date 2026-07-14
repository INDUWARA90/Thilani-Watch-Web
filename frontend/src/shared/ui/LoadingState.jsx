import { LoaderCircle } from 'lucide-react'

const shimmer = 'animate-pulse bg-gradient-to-r from-[#F8F9FA] via-[#DEE2E6] to-[#F8F9FA]'

export const LoadingState = ({ label = 'Loading', variant = 'panel', rows = 3 }) => {
  if (variant === 'cards') return <CardSkeleton count={rows} />
  if (variant === 'detail') return <DetailSkeleton />
  if (variant === 'form') return <FormSkeleton />
  if (variant === 'reviews') return <ReviewSkeleton count={rows} />
  if (variant === 'table') return <TableSkeleton rows={rows} />

  return (
    <div className="relative overflow-hidden border border-[#DEE2E6] bg-white p-5 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#F49006] to-transparent" />
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#121212] text-[#F49006]">
          <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-normal text-[#F49006]">Please wait</p>
          <p className="font-bold text-[#121212]">{label}</p>
        </div>
      </div>
    </div>
  )
}

export const ButtonSpinner = () => <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />

export const CardSkeleton = ({ count = 6 }) => (
  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <article className="overflow-hidden rounded-[20px] border border-[#DEE2E6] bg-white shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)]" key={index}>
        <div className={`${shimmer} aspect-[4/3] w-full`} />
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
  <section className="grid gap-8 border border-[#DEE2E6] bg-white p-5 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)] lg:grid-cols-[minmax(0,1fr)_440px]">
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
        <section className="border border-[#DEE2E6] bg-white p-5" key={index}>
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
    <aside className="h-fit border border-[#DEE2E6] bg-white p-5">
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
      <article className="border border-[#DEE2E6] bg-[#F8F9FA] p-4" key={index}>
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
  <div className="w-full overflow-x-auto border border-[#DEE2E6] bg-white">
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
