import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { experienceCards } from '@/features/storefront/lib/homeContent'

const bars = [
  { label: 'Quartz', value: 72 },
  { label: 'Automatic', value: 58 },
  { label: 'Smart', value: 46 },
]

export const HomeCtaSection = () => (
  <section className="mx-auto max-w-[1200px] px-4 py-14 pb-20 sm:px-6 lg:px-10">
    <motion.div
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center"
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-80px' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div>
        <p className="inline-flex min-h-8 items-center rounded-full border border-white/15 bg-white/5 px-3 text-xs font-semibold uppercase text-white/70">Collection insight</p>
        <h2 className="mt-4 max-w-2xl font-heading text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Find the timepiece that fits your life.
        </h2>
        <div className="mt-6 grid gap-3">
          {experienceCards.map(({ icon: Icon, title, text }) => (
            <div className="flex gap-3" key={title}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/12 bg-white/5 text-white">
                <Icon className="h-4 w-4" />
              </span>
              <p className="text-sm leading-6 text-white/70">
                <span className="font-semibold text-white">{title}.</span> {text}
              </p>
            </div>
          ))}
        </div>
        <motion.div className="mt-7 inline-block" whileHover={{ scale: 1.03 }}>
          <Link
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-black no-underline shadow-glowSm transition hover:shadow-glow"
            to="/watches"
          >
            Browse collection <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      <div className="rounded-lg border border-white/12 bg-surface p-6 shadow-glowSm">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase text-white/65">Comparison</p>
            <h3 className="mt-1 font-heading text-2xl font-bold text-white">Popular movement mix</h3>
          </div>
          <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/75">Live catalog</span>
        </div>
        <div className="mt-6 grid gap-5">
          {bars.map((bar) => (
            <div key={bar.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-white">{bar.label}</span>
                <span className="text-white/65">{bar.value}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/8">
                <motion.div
                  className="h-full rounded-full bg-white shadow-glowSm"
                  initial={{ width: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  whileInView={{ width: `${bar.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  </section>
)
