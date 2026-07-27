import { motion } from 'framer-motion'

const partners = ['SEIKO', 'CITIZEN', 'CASIO', 'FOSSIL', 'ORIENT', 'TIMEX']

export const HomeTrustStrip = () => (
  <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
    <motion.div
      className="border border-black/10 bg-[#FAF9F5]/80 px-6 py-10 shadow-xl"
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-80px' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Header Label */}
      <div className="mb-8 text-center">
        <span className="mb-3 inline-block text-[11px] font-medium uppercase tracking-[0.3em] text-[#F5C518]">
          Authorised & Partnered Brands
        </span>
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-neutral-500">
          Trusted by collectors and everyday wearers
        </p>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {partners.map((partner) => (
          <span
            className="group relative grid min-h-20 place-items-center border border-black bg-black px-4 font-serif text-sm font-normal uppercase tracking-[0.25em] text-neutral-400 transition-all duration-500 hover:border-[#F5C518] hover:text-[#F5C518] hover:shadow-2xl"
            key={partner}
          >
            {/* Subtle Gold Line Indicator on Hover */}
            <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#F5C518] transition-all duration-500 group-hover:w-full" />
            {partner}
          </span>
        ))}
      </div>
    </motion.div>
  </section>
)
