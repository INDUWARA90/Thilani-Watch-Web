import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { getCatalogImage, getCatalogValue, getTitle } from '@/features/storefront/lib/storefrontUtils'

export const HomeCatalogGrid = ({ eyebrow, fallbackItems, filterKey, isLoading = false, items, title, text }) => {
  const visibleItems = items.length > 0 ? items : fallbackItems

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8">
      {/* Editorial Header - Centered and clean */}
      <div className="mb-14 text-center max-w-xl mx-auto">
        {eyebrow && (
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 block mb-3">
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl font-light tracking-tight text-[#121212] sm:text-4xl font-serif">
          {title}
        </h2>
        {text && (
          <p className="mt-3 text-xs sm:text-sm tracking-wide text-gray-500 font-light leading-relaxed">
            {text}
          </p>
        )}
      </div>

      {/* Main Interactive Row Directory */}
      {isLoading ? (
        <CatalogListSkeleton />
      ) : (
        <div className="border-t border-gray-200">
          {visibleItems.slice(0, 4).map((item, index) => {
            const itemTitle = getTitle(item, item.name)
            const itemValue = getCatalogValue(item) || itemTitle
            const image = getCatalogImage(item)

            return (
              <Link
                className="group flex flex-col sm:flex-row sm:items-center justify-between py-8 border-b border-gray-200 transition-all duration-300 no-underline hover:px-4 hover:bg-gray-50/50"
                key={itemValue}
                to={`/watches?${filterKey}=${encodeURIComponent(itemValue)}`}
              >
                {/* Left Side: Index Number & Title details */}
                <div className="flex items-center gap-6 sm:gap-10">
                  <span className="text-xs font-mono text-gray-400 tracking-tighter">
                    0{index + 1}
                  </span>
                  
                  {/* Thumbnail Container: Reveals and pops on row hover */}
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:border-black">
                    {image ? (
                      <img 
                        alt={itemTitle} 
                        className="h-full w-full object-cover grayscale-[30%] transition-transform duration-500 group-hover:scale-110 group-hover:grayscale-0" 
                        src={image} 
                      />
                    ) : (
                      <span className="grid h-full w-full place-items-center bg-gray-900 text-sm font-semibold text-white">
                        {itemTitle.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-medium tracking-tight text-gray-900 group-hover:text-black sm:text-2xl">
                      {itemTitle}
                    </h3>
                    <p className="mt-1 max-w-md text-xs font-light text-gray-500 line-clamp-1">
                      {item.description || `View curated ${itemTitle} high-grade timepieces.`}
                    </p>
                  </div>
                </div>

                {/* Right Side: Sleek directional indicator */}
                <div className="mt-4 sm:mt-0 flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs font-medium uppercase tracking-widest text-gray-400 transition-colors duration-300 group-hover:text-black">
                    Discover Collection
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white transition-all duration-300 group-hover:rotate-45 group-hover:border-black group-hover:bg-black group-hover:text-white text-gray-600">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}

// Matching List Skeletons 
const CatalogListSkeleton = () => (
  <div className="border-t border-gray-100">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        className="flex items-center justify-between py-8 border-b border-gray-100"
        key={index}
      >
        <div className="flex items-center gap-6 sm:gap-10 w-full max-w-xl">
          <div className="h-3 w-4 animate-pulse rounded bg-gray-100" />
          <div className="h-14 w-14 animate-pulse rounded-full bg-gray-100 shrink-0" />
          <div className="w-full grid gap-2">
            <div className="h-5 w-1/3 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-50" />
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block h-3 w-28 animate-pulse rounded bg-gray-100" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100" />
        </div>
      </div>
    ))}
  </div>
)
