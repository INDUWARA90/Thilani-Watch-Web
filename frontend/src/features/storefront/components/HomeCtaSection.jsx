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
  <section className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
    <motion.div
      className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center"
      initial={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-80px' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Left Column: Editorial CTA Content */}
      <div>
        <span className="mb-4 inline-block text-[11px] font-medium uppercase tracking-[0.3em] text-[#F5C518]">
          Collection Insight
        </span>

        <div className="mb-6 h-[1px] w-12 bg-[#F5C518]/60" aria-hidden="true" />

        <h2 className="max-w-2xl font-serif text-3xl font-light tracking-tight text-black sm:text-5xl lg:text-6xl">
          Find the timepiece that fits your life.
        </h2>

        {/* Feature List */}
        <div className="mt-8 space-y-5">
          {experienceCards.map(({ icon: Icon, title, text }) => (
            <div className="flex items-start gap-4" key={title}>
              <span className="grid h-8 w-8 shrink-0 place-items-center border border-black bg-black text-[#F5C518]">
                <Icon className="h-4 w-4 stroke-[1.5]" />
              </span>
              <p className="font-sans text-xs sm:text-sm leading-relaxed text-neutral-600">
                <span className="font-medium text-black">{title}.</span> {text}
              </p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <motion.div className="mt-10 inline-block" whileHover={{ scale: 1.02 }}>
          <Link
            className="inline-flex items-center justify-center gap-3 border border-black bg-black px-8 py-4 font-sans text-xs font-medium uppercase tracking-[0.25em] text-white no-underline transition-all duration-300 hover:border-[#F5C518] hover:bg-[#F5C518] hover:text-black focus:outline-none"
            to="/watches"
          >
            Browse Collection <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      {/* Right Column: Comparison Card */}
      <div className="border border-black/10 bg-[#FAF9F5]/80 p-8 shadow-xl transition-all duration-500 hover:border-black/30">
        <div className="flex items-center justify-between border-b border-black/10 pb-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
              Comparison
            </p>
            <h3 className="mt-1 font-serif text-xl font-normal text-black">
              Popular Movement Mix
            </h3>
          </div>
          <span className="border border-[#F5C518]/40 bg-[#F5C518]/10 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-widest text-black">
            Live Catalog
          </span>
        </div>

        {/* Bars */}
        <div className="mt-8 space-y-6">
          {bars.map((bar) => (
            <div key={bar.label}>
              <div className="mb-2 flex items-center justify-between font-sans text-xs tracking-wider">
                <span className="font-medium uppercase text-black">{bar.label}</span>
                <span className="font-mono text-neutral-500">{bar.value}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden bg-black/10">
                <motion.div
                  className="h-full bg-[#F5C518]"
                  initial={{ width: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
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
