import { motion } from 'framer-motion'

const partners = ['SEIKO', 'CITIZEN', 'CASIO', 'FOSSIL', 'ORIENT', 'TIMEX']

export const HomeTrustStrip = () => (
  <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-10">
    <motion.div
      className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-6"
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-80px' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <p className="mb-5 text-center text-xs font-semibold uppercase text-white/75">Trusted by collectors and everyday wearers</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {partners.map((partner) => (
          <span
            className="grid min-h-14 place-items-center rounded-md border border-white/10 bg-black/20 px-4 font-heading text-sm font-bold text-white/70 grayscale transition hover:border-white/30 hover:text-white hover:grayscale-0 hover:drop-shadow-[0_0_14px_rgba(255,255,255,0.45)]"
            key={partner}
          >
            {partner}
          </span>
        ))}
      </div>
    </motion.div>
  </section>
)
