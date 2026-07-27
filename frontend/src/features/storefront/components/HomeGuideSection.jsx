import { motion } from 'framer-motion'
import { guideSteps } from '@/features/storefront/lib/homeContent'

export const HomeGuideSection = () => (
  <section className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-80px' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Header Section */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="mb-4 inline-block text-[11px] font-medium uppercase tracking-[0.3em] text-[#F5C518]">
          Buying Guide
        </span>

        <div className="mx-auto mb-6 h-[1px] w-12 bg-[#F5C518]/60" aria-hidden="true" />

        <h2 className="font-serif text-3xl font-light tracking-tight text-black sm:text-5xl lg:text-6xl">
          Choose With Confidence
        </h2>

        <p className="mt-4 font-sans text-xs sm:text-sm leading-relaxed text-neutral-600 tracking-wide max-w-xl mx-auto">
          Find the right movement, size, finish, and strap for the way you wear your watch every day.
        </p>
      </div>

      {/* Guide Steps Grid */}
      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {guideSteps.map(({ icon: Icon, title, text }) => (
          <motion.article
            className="group relative flex flex-col border border-black/10 bg-[#FAF9F5]/70 p-8 transition-all duration-500 hover:border-black/40 hover:bg-[#FAF9F5] hover:shadow-2xl"
            key={title}
            whileHover={{ y: -6 }}
          >

            {/* Icon Stage */}
            <div className="grid h-12 w-12 place-items-center border border-black bg-black text-[#F5C518] transition-all duration-500 group-hover:border-[#F5C518] group-hover:bg-[#F5C518] group-hover:text-black">
              <Icon className="h-5 w-5 stroke-[1.5]" />
            </div>

            {/* Content */}
            <h3 className="mt-8 font-serif text-2xl font-normal tracking-wide text-black">
              {title}
            </h3>

            <p className="mt-3 font-sans text-xs sm:text-sm leading-6 text-neutral-600">
              {text}
            </p>

            {/* Bottom Subtle Gold Accent Line on Hover */}
            <div className="mt-8 h-[1px] w-0 bg-[#F5C518] transition-all duration-500 group-hover:w-16" />
          </motion.article>
        ))}
      </div>
    </motion.div>
  </section>
)
