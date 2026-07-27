import { motion } from 'framer-motion'
import { guideSteps } from '@/features/storefront/lib/homeContent'

export const HomeGuideSection = () => (
  <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-10">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-80px' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="inline-flex min-h-8 items-center rounded-full border border-white/15 bg-white/5 px-3 text-xs font-semibold uppercase text-white/70">Buying guide</p>
        <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">Choose with confidence</h2>
        <p className="mt-3 text-sm leading-7 text-white/70 sm:text-base">
          Find the right movement, size, finish, and strap for the way you wear your watch every day.
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {guideSteps.map(({ icon: Icon, title, text }) => (
          <motion.article
            className="group rounded-lg border border-white/12 bg-surface p-6 transition hover:-translate-y-1 hover:border-white/35 hover:shadow-glow"
            key={title}
            whileHover={{ y: -4 }}
          >
            <span className="grid h-11 w-11 place-items-center rounded-md border border-white/10 bg-white/5 text-white transition group-hover:border-white/35 group-hover:shadow-glowSm">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-heading text-xl font-bold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">{text}</p>
          </motion.article>
        ))}
      </div>
    </motion.div>
  </section>
)
