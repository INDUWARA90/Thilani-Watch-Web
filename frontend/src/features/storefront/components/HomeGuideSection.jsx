import { motion } from 'framer-motion'
import { guideSteps } from '@/features/storefront/lib/homeContent'

export const HomeGuideSection = () => (
  <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-80px' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="mx-auto max-w-2xl text-center">
 <p className="inline-flex min-h-8 items-center border-b border-accent/60 px-0 pb-2 text-xs font-bold uppercase tracking-[0.24em] text-black">Buying guide</p>
 <div className="mx-auto mt-5 h-px w-20 bg-accent" aria-hidden="true" />
 <h2 className="mt-5 font-heading text-4xl font-bold leading-none tracking-wide text-black sm:text-6xl">Choose with confidence</h2>
 <p className="mt-3 text-sm leading-7 text-black">
          Find the right movement, size, finish, and strap for the way you wear your watch every day.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {guideSteps.map(({ icon: Icon, title, text }) => (
          <motion.article
 className="group rounded-lg border border-primary/10 bg-[linear-gradient(180deg,#ffffff_0%,#F8FAFC_100%)] p-7 shadow-premiumSm transition duration-300 hover:-translate-y-2 hover:border-accent/60 hover:shadow-goldHairline"
            key={title}
            whileHover={{ y: -4 }}
          >
 <span className="grid h-12 w-12 place-items-center rounded-md border border-accent/35 bg-primary text-accent transition duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-black">
              <Icon className="h-5 w-5" />
            </span>
 <h3 className="mt-6 font-heading text-2xl font-bold tracking-wide text-black">{title}</h3>
 <p className="mt-2 text-sm leading-6 text-black">{text}</p>
          </motion.article>
        ))}
      </div>
    </motion.div>
  </section>
)
