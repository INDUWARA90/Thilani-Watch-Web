import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { getCatalogImage, getCatalogValue, getTitle } from '@/features/storefront/lib/storefrontUtils'

export const HomeCatalogGrid = ({ eyebrow, fallbackItems, filterKey, isLoading = false, items, title, text }) => {
  const visibleItems = items.length > 0 ? items : fallbackItems

  return (
    <motion.section
      className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 sm:py-24 lg:px-10"
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-80px' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="mx-auto mb-12 max-w-2xl text-center">
        {eyebrow && (
 <span className="mb-5 inline-flex min-h-8 items-center border-b border-accent/60 px-0 pb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">
            {eyebrow}
          </span>
        )}
 <div className="mx-auto mb-5 h-px w-20 bg-accent" aria-hidden="true" />
 <h2 className="font-heading text-4xl font-bold leading-none tracking-wide text-primary sm:text-6xl">
          {title}
        </h2>
        {text && (
 <p className="mt-3 text-sm leading-7 text-black">
            {text}
          </p>
        )}
      </div>

      {isLoading ? (
        <CatalogListSkeleton />
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {visibleItems.slice(0, 4).map((item, index) => {
            const itemTitle = getTitle(item, item.name)
            const itemValue = getCatalogValue(item) || itemTitle
            const image = getCatalogImage(item)

            return (
              <Link
 className="group relative overflow-hidden rounded-lg border border-primary/10 bg-[linear-gradient(180deg,#ffffff_0%,#F8FAFC_100%)] px-5 pb-8 pt-5 text-center no-underline shadow-premiumSm transition duration-300 hover:-translate-y-2 hover:border-accent/60 hover:shadow-goldHairline"
                key={itemValue}
                to={`/watches?${filterKey}=${encodeURIComponent(itemValue)}`}
              >
 <span className="absolute left-5 top-4 font-sans text-xs text-primary">
                    0{index + 1}
                </span>

                <div className="relative mx-auto flex h-56 max-w-[220px] items-end justify-center">
 <div className="absolute bottom-7 h-px w-[68%] bg-primary/10" />
                  {image ? (
                    <img
                      alt={itemTitle}
                      className="relative z-10 max-h-48 w-auto max-w-full object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.18)] grayscale transition duration-500 group-hover:scale-110 group-hover:grayscale-0"
                      src={image}
                    />
                  ) : (
                    <span className="relative z-10 grid h-36 w-36 place-items-center rounded-full border border-primary/10 bg-primary font-heading text-4xl font-bold text-accent shadow-premiumSm transition group-hover:border-accent group-hover:bg-accent group-hover:text-primary">
                      {itemTitle.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

 <h3 className="mt-5 font-heading text-2xl font-bold tracking-tight text-primary">
                  {itemTitle}
                </h3>
 <p className="mx-auto mt-3 line-clamp-2 min-h-12 max-w-[230px] text-sm leading-6 text-primary">
                  {item.description || `View curated ${itemTitle} high-grade timepieces.`}
                </p>

 <span className="mt-5 inline-flex items-center justify-center gap-1 text-sm font-bold text-primary transition duration-200 group-hover:text-accent">
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
        className="rounded-lg border border-primary/10 bg-card px-5 pb-7 pt-4 text-center shadow-premiumSm"
        key={index}
      >
        <div className="mx-auto h-56 max-w-[220px] animate-pulse rounded bg-primary/10" />
        <div className="mx-auto mt-5 h-7 w-28 animate-pulse rounded bg-primary/10" />
        <div className="mx-auto mt-3 h-4 w-40 animate-pulse rounded bg-primary/10" />
        <div className="mx-auto mt-5 h-5 w-20 animate-pulse rounded bg-accent/35" />
      </div>
    ))}
  </div>
)
