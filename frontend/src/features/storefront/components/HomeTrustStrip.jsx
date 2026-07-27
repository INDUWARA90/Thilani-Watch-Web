import { motion } from 'framer-motion'

const partners = ['SEIKO', 'CITIZEN', 'CASIO', 'FOSSIL', 'ORIENT', 'TIMEX']

export const HomeTrustStrip = () => (
  <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-10">
    <motion.div
 className="rounded-lg border border-accent/25 bg-[linear-gradient(180deg,#ffffff_0%,#F8FAFC_100%)] px-5 py-7 shadow-goldHairline"
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-80px' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
 <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.22em] text-primary">Trusted by collectors and everyday wearers</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {partners.map((partner) => (
          <span
 className="grid min-h-16 place-items-center rounded-md border border-primary/10 bg-[linear-gradient(180deg,#111,#000)] px-4 font-heading text-lg font-bold tracking-[0.16em] text-white/80 grayscale transition duration-300 hover:-translate-y-1 hover:border-accent hover:text-accent hover:shadow-goldHairline hover:grayscale-0"
            key={partner}
          >
            {partner}
          </span>
        ))}
      </div>
    </motion.div>
  </section>
)
