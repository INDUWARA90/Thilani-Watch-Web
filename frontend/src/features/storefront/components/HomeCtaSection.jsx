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
  <section className="mx-auto max-w-[1200px] px-4 py-20 pb-24 sm:px-6 sm:py-24 lg:px-10">
    <motion.div
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center"
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-80px' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div>
 <p className="inline-flex min-h-8 items-center border-b border-accent/60 px-0 pb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">Collection insight</p>
 <div className="mt-5 h-px w-20 bg-accent" aria-hidden="true" />
 <h2 className="mt-5 max-w-2xl font-heading text-4xl font-bold leading-none tracking-wide text-primary sm:text-6xl">
          Find the timepiece that fits your life.
        </h2>
        <div className="mt-6 grid gap-3">
          {experienceCards.map(({ icon: Icon, title, text }) => (
            <div className="flex gap-3" key={title}>
 <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-primary/10 bg-primary text-accent">
                <Icon className="h-4 w-4" />
              </span>
 <p className="text-sm leading-6 text-primary">
 <span className="font-semibold text-primary">{title}.</span> {text}
              </p>
            </div>
          ))}
        </div>
        <motion.div className="mt-7 inline-block" whileHover={{ scale: 1.03 }}>
          <Link
 className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm font-bold text-primary no-underline shadow-premiumSm transition duration-200 hover:bg-accent/90 hover:shadow-premium focus:outline-none focus:ring-2 focus:ring-primary"
            to="/watches"
          >
            Browse collection <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      <div className="rounded-lg border border-accent/25 bg-[linear-gradient(180deg,#ffffff_0%,#F8FAFC_100%)] p-6 shadow-goldHairline">
        <div className="flex items-center justify-between border-b border-primary/10 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase text-primary">Comparison</p>
            <h3 className="mt-1 font-heading text-2xl font-bold text-primary">Popular movement mix</h3>
          </div>
          <span className="rounded-full border border-accent/60 bg-accent/15 px-3 py-1 text-xs font-semibold text-primary">Live catalog</span>
        </div>
        <div className="mt-6 grid gap-5">
          {bars.map((bar) => (
            <div key={bar.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-primary">{bar.label}</span>
                <span className="text-primary">{bar.value}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-primary/10">
                <motion.div
                  className="h-full rounded-full bg-accent shadow-premiumSm"
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
