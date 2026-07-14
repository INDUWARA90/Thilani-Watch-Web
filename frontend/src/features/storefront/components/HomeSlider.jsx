import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import heroImage from '@/assets/hero.png'

const slides = [
  {
    badge: 'Luxury watch collection',
    title: 'Modern watches for every important moment.',
    copy: 'Shop premium styles, trusted brands, and fresh arrivals from one bright, polished storefront.',
    path: '/watches',
    action: 'Shop watches',
  },
  {
    badge: 'New season edit',
    title: 'Fresh designs with confident everyday style.',
    copy: 'Find watches that pair clean details with a refined, wearable finish.',
    path: '/watches?sort=newest',
    action: 'See new watches',
  },
  {
    badge: 'Featured picks',
    title: 'Selected pieces with strong modern appeal.',
    copy: 'Browse watches chosen for standout design, quality presence, and simple discovery.',
    path: '/watches?featured=true',
    action: 'View featured',
  },
]

export const HomeSlider = () => (
  <section className="relative -mx-4 -mt-8 overflow-hidden bg-[linear-gradient(135deg,#F49006_0%,#EB960E_100%)] px-4 pb-28 pt-16 text-white sm:-mx-6 sm:px-6 sm:pt-20 lg:-mx-8 lg:px-10">
    <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <p className="mb-4 inline-flex min-h-11 items-center rounded-[14px] border border-white bg-white/20 px-5 text-sm font-normal text-white">
          {slides[0].badge}
        </p>
        <h1 className="mb-5 max-w-4xl text-[44px] font-extrabold leading-[1.1] text-white sm:text-[56px] lg:text-[65px] lg:leading-[71px]">
          {slides[0].title}
        </h1>
        <p className="mb-8 max-w-2xl text-base leading-7 text-white sm:text-lg lg:text-[22px] lg:leading-[31px]">
          {slides[0].copy}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] bg-[#121212] px-8 text-sm font-normal text-white no-underline transition hover:bg-[#272222] active:scale-[0.98]" to={slides[0].path}>
            {slides[0].action} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] border border-white bg-white/20 px-8 text-sm font-normal text-white no-underline transition hover:bg-white hover:text-[#121212]" to="/watches?featured=true">
            Featured <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      <motion.div className="rounded-[20px] border border-white bg-white/20 p-5 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)] backdrop-blur" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.15 }}>
        <img className="aspect-[4/3] w-full rounded-[20px] bg-white/20 object-cover" src={heroImage} alt="Featured watches" />
        <div className="mt-4 grid gap-3">
          {slides.slice(1).map((slide, index) => (
            <Link className="rounded-[20px] border border-white bg-white/20 p-4 text-white no-underline transition hover:bg-white/25 hover:shadow-[16px_18px_16px_0_rgba(0,0,0,0.1)]" key={slide.title} to={slide.path}>
              <span className="text-sm font-normal text-white/80">0{index + 2}</span>
              <strong className="mt-1 block text-lg leading-snug text-white">{slide.title}</strong>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
    <svg className="absolute bottom-[-1px] left-0 h-20 w-full text-white" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d="M0 70L60 62.7C120 55 240 41 360 49.3C480 58 600 88 720 92.7C840 98 960 77 1080 63.3C1200 50 1320 44 1380 41.3L1440 39V120H0V70Z" />
    </svg>
  </section>
)
