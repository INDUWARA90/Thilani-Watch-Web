import { ArrowRight, BadgeCheck, Clock3, Rotate3D, ScanSearch, Sparkles, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { formatMoney, getCatalogValue, getTitle, getWatchImage } from '@/features/storefront/lib/storefrontUtils'

const fallbackMotionCards = [
  { icon: ScanSearch, title: 'Inspect details', text: 'Notice the glass shine, case shape, dial depth, and strap finish before you choose.' },
  { icon: Rotate3D, title: 'Feel the depth', text: 'Layered motion gives each watch a showroom-like presence on the page.' },
  { icon: Zap, title: 'Compare faster', text: 'Move from style to style quickly and find the piece that suits your routine.' },
  { icon: BadgeCheck, title: 'Buy with trust', text: 'Authentic products, careful checking, and after-sales support are part of every order.' },
]

const variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const getPriceLine = (watch) => {
  const price = watch?.salePrice || watch?.price
  if (!price) return 'Explore this curated timepiece from the live collection.'

  return `${formatMoney(price, watch?.currency)} with refined everyday presence.`
}

const getWatchLink = (watch) => (watch?._id || watch?.id ? `/watches/${watch._id || watch.id}` : '/watches')

const getCount = (items, fallback = '0') => (items?.length ? String(items.length).padStart(2, '0') : fallback)

const buildApiCards = (home) => {
  const cards = []
  const featured = home?.featured?.[0]
  const arrival = home?.newArrivals?.[0]
  const seller = home?.bestSellers?.[0]
  const category = home?.categories?.[0]
  const brand = home?.brands?.[0]

  if (featured) {
    cards.push({
      icon: ScanSearch,
      image: getWatchImage(featured),
      link: getWatchLink(featured),
      text: getPriceLine(featured),
      title: getTitle(featured, 'Featured watch'),
    })
  }

  if (arrival) {
    cards.push({
      icon: Sparkles,
      image: getWatchImage(arrival),
      link: getWatchLink(arrival),
      text: getPriceLine(arrival),
      title: getTitle(arrival, 'New arrival'),
    })
  }

  if (seller) {
    cards.push({
      icon: Zap,
      image: getWatchImage(seller),
      link: getWatchLink(seller),
      text: getPriceLine(seller),
      title: getTitle(seller, 'Best seller'),
    })
  }

  if (category) {
    const title = getTitle(category, 'Watch collection')
    const value = getCatalogValue(category) || title

    cards.push({
      icon: Rotate3D,
      link: `/watches?category=${encodeURIComponent(value)}`,
      text: category.description || `Browse ${title} watches selected for style, comfort, and daily confidence.`,
      title,
    })
  }

  if (brand) {
    const title = getTitle(brand, 'Trusted brand')
    const value = getCatalogValue(brand) || title

    cards.push({
      icon: BadgeCheck,
      link: `/watches?brand=${encodeURIComponent(value)}`,
      text: brand.description || `Explore ${title} timepieces from the live catalog.`,
      title,
    })
  }

  return cards.length > 0 ? cards : fallbackMotionCards.map((card) => ({ ...card, link: '/watches' }))
}

export const HomeKineticExperience = ({ home = {}, loading = {} }) => {
  const cards = buildApiCards(home)
  const journey = [
    { label: 'Featured', loading: loading.featured, value: getCount(home.featured, '01') },
    { label: 'Arrivals', loading: loading.newArrivals, value: getCount(home.newArrivals, '02') },
    { label: 'Brands', loading: loading.brands, value: getCount(home.brands, '03') },
    { label: 'Categories', loading: loading.categories, value: getCount(home.categories, '04') },
  ]

  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.012),transparent)] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <div className="absolute inset-x-0 top-16 h-px bg-white/10" aria-hidden="true" />
      <motion.div
        className="mx-auto max-w-[1200px]"
        initial="hidden"
        transition={{ staggerChildren: 0.08 }}
        viewport={{ once: true, margin: '-90px' }}
        whileInView="show"
      >
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <motion.div variants={variants}>
            <p className="inline-flex min-h-8 items-center rounded-full border border-white/15 bg-white/5 px-3 text-xs font-semibold uppercase text-white/75">
              Live shopping experience
            </p>
            <h2 className="mt-4 max-w-2xl font-heading text-3xl font-bold leading-tight text-white sm:text-5xl">
              Discover what is live in the collection now.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
              Featured watches, new arrivals, brands, and categories update here from the same catalog data used across the shop.
            </p>
          </motion.div>

          <motion.div className="grid gap-3 sm:grid-cols-4" variants={variants}>
            {journey.map((step, index) => (
              <motion.div
                className="relative overflow-hidden rounded-lg border border-white/12 bg-white/[0.04] p-4 shadow-glowSm"
                key={step.label}
                transition={{ delay: index * 0.06, duration: 0.45, ease: 'easeOut' }}
                whileHover={{ y: -5, scale: 1.025 }}
              >
                <div className="kinetic-scan absolute inset-0" />
                <span className="font-heading text-3xl font-bold text-white">{step.loading ? '--' : step.value}</span>
                <span className="mt-5 block text-xs font-semibold uppercase text-white/65">{step.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="mt-10 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
          <motion.div
            className="relative min-w-0 overflow-hidden rounded-lg border border-white/12 bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.13),rgba(255,255,255,0.04)_36%,rgba(255,255,255,0.02)_100%)] p-4 shadow-glowSm sm:p-5"
            variants={variants}
          >
            <div className="pointer-events-none absolute inset-x-8 bottom-10 h-20 rounded-full bg-white/18 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" aria-hidden="true" />

            <motion.div
              className="flex cursor-grab gap-4 active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: -420, right: 0 }}
              dragElastic={0.14}
            >
              {cards.map(({ icon: Icon, image, link, title, text }, index) => (
                <motion.article
                  className="group relative min-h-[260px] w-[min(250px,74vw)] shrink-0 overflow-hidden rounded-lg border border-white/12 bg-black/55 p-5 shadow-glowSm backdrop-blur-sm sm:w-[290px]"
                  key={`${title}-${index}`}
                  transition={{ type: 'spring', stiffness: 190, damping: 18 }}
                  whileHover={{ rotateY: index % 2 === 0 ? 8 : -8, y: -8, scale: 1.03 }}
                >
                  <Link className="absolute inset-0 z-20" to={link}>
                    <span className="sr-only">View {title}</span>
                  </Link>
                  <div className="kinetic-scan absolute inset-0 opacity-60" />
                  <span className="relative z-10 grid h-12 w-12 place-items-center rounded-md border border-white/15 bg-white/5 text-white shadow-glowSm">
                    <Icon className="h-5 w-5" />
                  </span>
                  {image && (
                    <img
                      alt=""
                      className="absolute right-4 top-4 h-28 w-28 object-contain opacity-70 grayscale transition duration-500 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0"
                      src={image}
                    />
                  )}
                  <h3 className="relative z-10 mt-16 line-clamp-2 font-heading text-2xl font-bold text-white">{title}</h3>
                  <p className="relative z-10 mt-3 line-clamp-3 text-sm leading-6 text-white/70">{text}</p>
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-white/10 bg-white/[0.035] transition group-hover:scale-125 group-hover:border-white/25" />
                </motion.article>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="relative min-h-[390px] min-w-0 overflow-hidden rounded-lg border border-white/12 bg-surface p-4 shadow-glowSm sm:min-h-[380px] sm:p-5"
            variants={variants}
          >
            <div className="absolute inset-x-8 bottom-8 h-16 rounded-full bg-white/20 blur-3xl" aria-hidden="true" />
            <div className="depth-card depth-card-one absolute left-3 top-10 h-36 w-[min(192px,58vw)] rounded-lg border border-white/16 bg-white/[0.06] p-4 shadow-glowSm sm:left-8 sm:h-40 sm:w-56">
              <Sparkles className="h-5 w-5 text-white" />
              <p className="mt-14 text-xs font-semibold uppercase text-white/60">
                {loading.newArrivals ? 'Loading arrivals' : `${getCount(home.newArrivals)} new arrivals`}
              </p>
            </div>
            <div className="depth-card depth-card-two absolute right-3 top-28 h-40 w-[min(192px,58vw)] rounded-lg border border-white/16 bg-black/70 p-4 shadow-glowSm backdrop-blur-sm sm:right-8 sm:top-24 sm:h-44 sm:w-56">
              <Clock3 className="h-5 w-5 text-white" />
              <p className="mt-16 text-xs font-semibold uppercase text-white/60">
                {loading.bestSellers ? 'Loading favorites' : `${getCount(home.bestSellers)} customer favorites`}
              </p>
            </div>
            <div className="depth-card depth-card-three absolute bottom-10 left-1/2 h-36 w-[min(224px,72vw)] -translate-x-1/2 rounded-lg border border-white/20 bg-white/[0.08] p-4 shadow-glow backdrop-blur-sm sm:h-40 sm:w-60">
              <span className="block font-heading text-4xl font-bold text-white">{loading.featured ? '--' : getCount(home.featured)}</span>
              <p className="mt-8 text-xs font-semibold uppercase text-white/65">Featured live now</p>
            </div>
          </motion.div>
        </div>

        <motion.div className="mt-8 flex justify-center" variants={variants} whileHover={{ scale: 1.03 }}>
          <Link
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 text-sm font-bold text-white no-underline shadow-glowSm transition hover:border-white/55 hover:bg-white/10 hover:shadow-glow"
            to="/watches"
          >
            Explore the live collection <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
