import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import heroImage from '@/assets/hero.png'

const slides = [
  {
    badge: 'Luxury watch collection',
    title: 'Modern watches for every important moment.',
    copy: 'Shop premium styles, trusted brands, and fresh arrivals from one polished storefront.',
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
  <section className="relative overflow-hidden rounded-lg bg-slate-950 text-white shadow-[0_28px_90px_rgba(15,23,42,0.22)]">
    <img className="absolute inset-0 h-full w-full object-cover opacity-45" src={heroImage} alt="" aria-hidden="true" />
    <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(15,23,42,0.96)_0%,rgba(15,23,42,0.78)_48%,rgba(15,23,42,0.28)_100%)]" />
    <div className="relative grid min-h-[540px] items-center gap-8 p-6 md:grid-cols-[1fr_380px] md:p-10 lg:p-14">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <p className="mb-4 inline-flex rounded-lg border border-[#D4AF37]/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37] backdrop-blur">
          {slides[0].badge}
        </p>
        <h1 className="mb-5 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">{slides[0].title}</h1>
        <p className="mb-8 max-w-2xl text-lg leading-8 text-slate-200">{slides[0].copy}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-5 font-extrabold text-slate-950 no-underline transition hover:bg-white" to={slides[0].path}>
            {slides[0].action} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-5 font-extrabold text-white no-underline backdrop-blur transition hover:bg-white hover:text-slate-950" to="/watches?featured=true">
            Featured <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      <motion.div className="hidden space-y-3 md:block" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.15 }}>
        {slides.map((slide, index) => (
          <Link className={`block rounded-lg border p-4 text-white no-underline backdrop-blur transition hover:border-[#D4AF37] ${index === 0 ? 'border-[#D4AF37]/70 bg-white/15' : 'border-white/15 bg-white/10'}`} key={slide.title} to={slide.path}>
            <span className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">0{index + 1}</span>
            <strong className="mt-2 block text-lg leading-snug">{slide.title}</strong>
            <span className="mt-2 line-clamp-2 block text-sm leading-6 text-slate-300">{slide.copy}</span>
          </Link>
        ))}
      </motion.div>
    </div>
  </section>
)
