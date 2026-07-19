import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { getCatalogImage, getCatalogValue, getTitle } from '@/features/storefront/lib/storefrontUtils'

export const HomeCatalogGrid = ({ eyebrow, fallbackItems, filterKey, isLoading = false, items, title, text }) => {
  const visibleItems = items.length > 0 ? items : fallbackItems

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mb-6 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#F49006]">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-[#121212] sm:text-4xl">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-[#6C757D] sm:text-base">{text}</p>
      </div>

      {isLoading ? (
        <CatalogSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleItems.slice(0, 4).map((item) => {
          const itemTitle = getTitle(item, item.name)
          const itemValue = getCatalogValue(item) || itemTitle
          const image = getCatalogImage(item)

          return (
            <Link
              className="group min-h-[190px] overflow-hidden rounded-[18px] border border-[#DEE2E6] bg-white p-5 text-[#121212] no-underline shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.04)] transition hover:border-[#F49006]"
              key={itemValue}
              to={`/watches?${filterKey}=${encodeURIComponent(itemValue)}`}
            >
              <div className="flex h-full flex-col">
                {image ? (
                  <img alt={itemTitle} className="mb-4 h-16 w-16 rounded-[14px] object-cover" src={image} />
                ) : (
                  <span className="mb-4 grid h-16 w-16 place-items-center rounded-[14px] bg-[#F49006]/10 text-2xl font-black text-[#F49006]">
                    {itemTitle.charAt(0)}
                  </span>
                )}
                <h3 className="text-xl font-black">{itemTitle}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6C757D]">
                  {item.description || `Explore ${itemTitle} watches.`}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[#F49006]">
                  Browse <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          )
          })}
        </div>
      )}
    </section>
  )
}

const CatalogSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        className="min-h-[190px] rounded-[18px] border border-[#DEE2E6] bg-white p-5 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.04)]"
        key={index}
      >
        <div className="mb-4 h-16 w-16 animate-pulse rounded-[14px] bg-slate-100" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 grid gap-2">
          <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="mt-8 h-4 w-20 animate-pulse rounded bg-orange-100" />
      </div>
    ))}
  </div>
)
