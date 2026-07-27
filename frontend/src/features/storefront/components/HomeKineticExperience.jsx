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
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
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
    <section className="relative overflow-hidden border-b border-black/10 px-6 py-24 text-black lg:px-12">
      <div className="absolute inset-x-0 top-16 h-[1px] bg-[#F5C518]/30" aria-hidden="true" />
      <motion.div
        className="mx-auto max-w-7xl"
        initial="hidden"
        transition={{ staggerChildren: 0.08 }}
        viewport={{ once: true, margin: '-90px' }}
        whileInView="show"
      >
        {/* Header and Quick Stats */}
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <motion.div variants={variants}>
            <span className="mb-4 inline-block text-[11px] font-medium uppercase tracking-[0.3em] text-[#F5C518]">
              Live Shopping Experience
            </span>

            <div className="mb-6 h-[1px] w-12 bg-[#F5C518]/60" aria-hidden="true" />

            <h2 className="max-w-2xl font-serif text-3xl font-light tracking-tight text-black sm:text-5xl lg:text-6xl">
              Discover what is live in the collection now.
            </h2>

            <p className="mt-4 max-w-xl font-sans text-xs sm:text-sm leading-relaxed text-neutral-600">
              Featured watches, new arrivals, brands, and categories update here from the same catalog data used across the shop.
            </p>
          </motion.div>

          {/* Journey Counter Cards */}
          <motion.div className="grid gap-4 sm:grid-cols-4" variants={variants}>
            {journey.map((step, index) => (
              <motion.div
                className="group relative overflow-hidden border border-black/10 bg-[#FAF9F5]/80 p-5 transition-all duration-300 hover:border-black/40 hover:bg-[#FAF9F5]"
                key={step.label}
                transition={{ delay: index * 0.06, duration: 0.45, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
              >
                <div className="kinetic-scan absolute inset-0 opacity-40" />
                <span className="font-serif text-3xl font-light text-black">
                  {step.loading ? '--' : step.value}
                </span>
                <span className="mt-4 block font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 group-hover:text-black transition-colors">
                  {step.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Carousel & Showcase Area */}
        <div className="mt-12 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
          {/* Draggable Carousel Container */}
          <motion.div
            className="relative min-w-0 overflow-hidden border border-black/10 bg-[#FAF9F5]/80 p-6 sm:p-8"
            variants={variants}
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/5" aria-hidden="true" />

            <motion.div
              className="flex cursor-grab gap-6 active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: -420, right: 0 }}
              dragElastic={0.14}
            >
              {cards.map(({ icon: Icon, image, link, title, text }, index) => (
                <motion.article
                  className="group relative min-h-[280px] w-[min(260px,74vw)] shrink-0 overflow-hidden border border-black/80 bg-black p-6 shadow-2xl transition-all duration-500 sm:w-[300px]"
                  key={`${title}-${index}`}
                  transition={{ type: 'spring', stiffness: 190, damping: 18 }}
                  whileHover={{ rotateY: index % 2 === 0 ? 6 : -6, y: -6, scale: 1.02 }}
                >
                  <Link className="absolute inset-0 z-20" to={link}>
                    <span className="sr-only">View {title}</span>
                  </Link>
                  <div className="kinetic-scan absolute inset-0 opacity-40" />

                  <span className="relative z-10 grid h-10 w-10 place-items-center border border-white/20 bg-white/10 text-[#F5C518]">
                    <Icon className="h-4 w-4 stroke-[1.5]" />
                  </span>

                  {image && (
                    <img
                      alt=""
                      className="absolute right-4 top-4 h-28 w-28 object-contain opacity-60 transition duration-700 group-hover:scale-110 group-hover:opacity-100"
                      src={image}
                    />
                  )}

                  <h3 className="relative z-10 mt-16 line-clamp-2 font-serif text-2xl font-light text-white">
                    {title}
                  </h3>

                  <p className="relative z-10 mt-3 line-clamp-3 font-sans text-xs leading-5 text-neutral-400">
                    {text}
                  </p>

                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-white/10 bg-white/[0.02] transition duration-500 group-hover:scale-125 group-hover:border-[#F5C518]/30" />
                </motion.article>
              ))}
            </motion.div>
          </motion.div>

          {/* Depth Card Stage */}
          <motion.div
            className="relative min-h-[400px] min-w-0 overflow-hidden border border-black/10 bg-[#FAF9F5]/80 p-6 sm:min-h-[380px]"
            variants={variants}
          >
            <div className="depth-card depth-card-one absolute left-4 top-10 h-36 w-[min(200px,58vw)] border border-black/10 bg-white p-5 shadow-xl sm:left-8 sm:h-40 sm:w-56">
              <Sparkles className="h-4 w-4 text-[#F5C518]" />
              <p className="mt-14 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-black">
                {loading.newArrivals ? 'Loading arrivals' : `${getCount(home.newArrivals)} new arrivals`}
              </p>
            </div>

            <div className="depth-card depth-card-two absolute right-4 top-28 h-40 w-[min(200px,58vw)] border border-black bg-black p-5 shadow-2xl backdrop-blur-md sm:right-8 sm:top-24 sm:h-44 sm:w-56">
              <Clock3 className="h-4 w-4 text-[#F5C518]" />
              <p className="mt-16 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                {loading.bestSellers ? 'Loading favorites' : `${getCount(home.bestSellers)} customer favorites`}
              </p>
            </div>

            <div className="depth-card depth-card-three absolute bottom-10 left-1/2 h-36 w-[min(230px,72vw)] -translate-x-1/2 border border-black/20 bg-white p-5 shadow-2xl sm:h-40 sm:w-60">
              <span className="block font-serif text-4xl font-light text-black">
                {loading.featured ? '--' : getCount(home.featured)}
              </span>
              <p className="mt-8 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-black">
                Featured live now
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div className="mt-12 flex justify-center" variants={variants} whileHover={{ scale: 1.02 }}>
          <Link
            className="inline-flex items-center justify-center gap-3 border border-black bg-black px-8 py-4 font-sans text-xs font-medium uppercase tracking-[0.25em] text-white no-underline transition-all duration-300 hover:border-[#F5C518] hover:bg-[#F5C518] hover:text-black focus:outline-none"
            to="/watches"
          >
            Explore The Live Collection <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
