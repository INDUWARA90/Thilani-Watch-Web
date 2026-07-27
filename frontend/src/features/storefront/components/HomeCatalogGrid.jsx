import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { getCatalogImage, getCatalogValue, getTitle } from '@/features/storefront/lib/storefrontUtils'

export const HomeCatalogGrid = ({ eyebrow, fallbackItems, filterKey, isLoading = false, items, title, text }) => {
  const visibleItems = items.length > 0 ? items : fallbackItems

  return (
    <motion.section
      className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-10"
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-80px' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="mx-auto mb-10 max-w-xl text-center">
        {eyebrow && (
          <span className="mb-4 inline-flex min-h-8 items-center rounded-full border border-white/15 bg-white/5 px-3 text-xs font-semibold uppercase text-white/70">
            {eyebrow}
          </span>
        )}
        <h2 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {title}
        </h2>
        {text && (
          <p className="mt-3 text-sm leading-7 text-white/70">
            {text}
          </p>
        )}
      </div>

      {isLoading ? (
        <CatalogListSkeleton />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleItems.slice(0, 4).map((item, index) => {
            const itemTitle = getTitle(item, item.name)
            const itemValue = getCatalogValue(item) || itemTitle
            const image = getCatalogImage(item)

            return (
              <Link
                className="group relative overflow-hidden rounded-lg border border-transparent px-5 pb-7 pt-4 text-center no-underline transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.03] hover:shadow-glowSm"
                key={itemValue}
                to={`/watches?${filterKey}=${encodeURIComponent(itemValue)}`}
              >
                <span className="absolute left-5 top-4 font-mono text-xs text-white/25">
                    0{index + 1}
                </span>

                <div className="relative mx-auto flex h-56 max-w-[220px] items-end justify-center">
                  <div className="absolute bottom-8 h-12 w-[72%] rounded-full bg-white/12 blur-2xl transition group-hover:bg-white/22" />
                  <div className="absolute bottom-7 h-px w-[68%] bg-white/25 shadow-glowSm" />
                  {image ? (
                    <img
                      alt={itemTitle}
                      className="relative z-10 max-h-48 w-auto max-w-full object-contain grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                      src={image}
                    />
                  ) : (
                    <span className="relative z-10 grid h-36 w-36 place-items-center rounded-full border border-white/12 bg-white/5 font-heading text-4xl font-bold text-white/80 shadow-glowSm transition group-hover:border-white/30 group-hover:text-white">
                      {itemTitle.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <h3 className="mt-5 font-heading text-2xl font-bold tracking-tight text-white">
                  {itemTitle}
                </h3>
                <p className="mx-auto mt-3 line-clamp-2 min-h-12 max-w-[230px] text-sm leading-6 text-white/65">
                  {item.description || `View curated ${itemTitle} high-grade timepieces.`}
                </p>

                <span className="mt-5 inline-flex items-center justify-center gap-1 text-sm font-bold text-white/65 transition group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]">
                  Explore <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </motion.section>
  )
}

const CatalogListSkeleton = () => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        className="rounded-lg border border-white/10 px-5 pb-7 pt-4 text-center"
        key={index}
      >
        <div className="mx-auto h-56 max-w-[220px] animate-pulse rounded bg-white/5" />
        <div className="mx-auto mt-5 h-7 w-28 animate-pulse rounded bg-white/10" />
        <div className="mx-auto mt-3 h-4 w-40 animate-pulse rounded bg-white/5" />
        <div className="mx-auto mt-5 h-5 w-20 animate-pulse rounded bg-white/10" />
      </div>
    ))}
  </div>
)
