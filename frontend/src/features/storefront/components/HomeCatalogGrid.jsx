import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { getCatalogImage, getCatalogValue, getTitle } from '@/features/storefront/lib/storefrontUtils'

export const HomeCatalogGrid = ({ eyebrow, fallbackItems, filterKey, isLoading = false, items, title, text }) => {
  const visibleItems = items.length > 0 ? items : fallbackItems
  const scrollerRef = useRef(null)
  const [scrollState, setScrollState] = useState({ canNext: false, canPrev: false })

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth

    setScrollState({
      canPrev: scroller.scrollLeft > 2,
      canNext: scroller.scrollLeft < maxScrollLeft - 2,
    })
  }, [])

  useEffect(() => {
    updateScrollState()
    window.addEventListener('resize', updateScrollState)

    return () => window.removeEventListener('resize', updateScrollState)
  }, [isLoading, updateScrollState, visibleItems.length])

  const slideCatalog = (direction) => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const firstCard = scroller.querySelector('[data-catalog-card]')
    const cardWidth = firstCard?.getBoundingClientRect().width || scroller.clientWidth

    scroller.scrollBy({
      behavior: 'smooth',
      left: direction * (cardWidth + 32),
    })
  }

  const showControls = scrollState.canPrev || scrollState.canNext

  return (
    <motion.section
      className="mx-auto max-w-7xl px-6 py-24 lg:px-12"
      initial={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-80px' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Header Section */}
      <div className="mx-auto mb-16 max-w-3xl text-center">
        {eyebrow && (
          <span className="mb-4 inline-block text-[11px] font-medium uppercase tracking-[0.3em] text-[#F5C518]">
            {eyebrow}
          </span>
        )}

        <div className="mx-auto mb-6 h-[1px] w-12 bg-[#F5C518]/60" aria-hidden="true" />

        <h2 className="font-serif text-3xl font-light tracking-tight text-black sm:text-5xl lg:text-6xl">
          {title}
        </h2>

        {text && (
          <p className="mt-4 font-sans text-xs sm:text-sm leading-relaxed text-neutral-600 tracking-wide max-w-xl mx-auto">
            {text}
          </p>
        )}
      </div>

      {/* Catalog Slider / Skeleton */}
      {isLoading ? (
        <CatalogListSkeleton />
      ) : (
        <div className="relative">
          {showControls && (
            <>
              <button
                aria-label={`Previous ${title}`}
                className="absolute left-0 top-1/2 z-20 grid h-11 w-11 -translate-x-3 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-black text-[#F5C518] shadow-xl transition-all hover:border-[#F5C518] hover:bg-[#151515] disabled:pointer-events-none disabled:opacity-25 sm:h-12 sm:w-12 lg:-translate-x-8"
                disabled={!scrollState.canPrev}
                onClick={() => slideCatalog(-1)}
                type="button"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                aria-label={`Next ${title}`}
                className="absolute right-0 top-1/2 z-20 grid h-11 w-11 translate-x-3 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-black text-[#F5C518] shadow-xl transition-all hover:border-[#F5C518] hover:bg-[#151515] disabled:pointer-events-none disabled:opacity-25 sm:h-12 sm:w-12 lg:translate-x-8"
                disabled={!scrollState.canNext}
                onClick={() => slideCatalog(1)}
                type="button"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div
            className="flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={updateScrollState}
            ref={scrollerRef}
          >
            {visibleItems.map((item) => {
              const itemTitle = getTitle(item, item.name)
              const itemValue = getCatalogValue(item) || itemTitle
              const image = getCatalogImage(item)

              return (
                <Link
                  className="group relative flex min-h-[326px] w-[82vw] shrink-0 snap-start flex-col justify-between overflow-hidden border border-black/10 bg-[#FAF9F5]/80 p-6 text-center no-underline transition-all duration-500 hover:border-black/40 hover:bg-[#FAF9F5] hover:shadow-2xl sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-6rem)/4)]"
                  data-catalog-card
                  key={itemValue}
                  to={`/watches?${filterKey}=${encodeURIComponent(itemValue)}`}
                >
                  {/* Single Circle Watch Image Container */}
                  <div className="relative mx-auto flex h-48 w-48 items-center justify-center pt-4">
                    {image ? (
                      <img
                        alt={itemTitle}
                        className="relative z-10 h-44 w-44 rounded-full border border-black/10 bg-white/60 p-3 object-contain transition-all duration-700 ease-out group-hover:scale-105 group-hover:border-[#F5C518]/80 group-hover:shadow-md"
                        src={image}
                      />
                    ) : (
                      <span className="relative z-10 grid h-44 w-44 place-items-center rounded-full border border-black/10 bg-black font-serif text-2xl font-light text-[#F5C518] transition-colors duration-500 group-hover:border-[#F5C518]">
                        {itemTitle.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Content Details */}
                  <div className="mt-6 flex flex-col items-center">
                    <h3 className="font-serif text-xl font-normal tracking-wide text-black">
                      {itemTitle}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-10 max-w-[220px] font-sans text-xs leading-5 text-neutral-600">
                      {item.description || `View curated ${itemTitle} high-grade timepieces.`}
                    </p>

                    {/* CTA Link */}
                    <span className="mt-6 inline-flex items-center justify-center gap-2 border-b border-transparent py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-black transition-all duration-300 group-hover:border-[#F5C518]">
                      Explore <ChevronRight className="h-3.5 w-3.5 text-[#F5C518] transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </motion.section>
  )
}

const CatalogListSkeleton = () => (
  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        className="flex flex-col border border-black/5 bg-[#FAF9F5]/80 p-6 text-center"
        key={index}
      >
        <div className="mx-auto h-44 w-44 animate-pulse rounded-full bg-black/5" />
        <div className="mx-auto mt-6 h-5 w-32 animate-pulse bg-black/10" />
        <div className="mx-auto mt-3 h-8 w-44 animate-pulse bg-black/5" />
        <div className="mx-auto mt-6 h-4 w-20 animate-pulse bg-[#F5C518]/20" />
      </div>
    ))}
  </div>
)
