import { Activity, Gauge, Hand, Sparkles, Watch } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const highlights = [
  { icon: Watch, label: 'Case depth', value: '42mm' },
  { icon: Gauge, label: 'Water rating', value: '5 ATM' },
  { icon: Sparkles, label: 'Crystal', value: 'Sapphire' },
]

const dialMarkers = Array.from({ length: 12 }, (_, index) => index)

export const HomeInteractiveShowcase = () => {
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 110, damping: 18 })
  const smoothY = useSpring(pointerY, { stiffness: 110, damping: 18 })
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-16, 16])
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [13, -13])

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5)
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5)
  }

  const handlePointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <section className="relative overflow-hidden border-y border-accent/20 px-4 py-20 text-primary sm:px-6 sm:py-24 lg:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-accent/20" aria-hidden="true" />
      <div className="mx-auto grid max-w-[1200px] min-w-0 gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1fr)] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-90px' }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <p className="inline-flex min-h-8 items-center border-b border-accent/60 px-0 pb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary/70">
            Signature showcase
          </p>
          <div className="mt-5 h-px w-20 bg-accent" aria-hidden="true" />
          <h2 className="mt-5 max-w-2xl font-heading text-4xl font-bold leading-none tracking-wide text-primary sm:text-6xl">
            See the shine, depth, and detail up close.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-primary/75 sm:text-base">
            Move across the dial to experience polished metal, layered glass, and soft silver highlights inspired by premium watch craftsmanship.
          </p>

          <div className="mt-7 grid min-w-0 gap-3 sm:grid-cols-3 lg:max-w-xl">
            {highlights.map(({ icon: Icon, label, value }, index) => (
              <motion.div
                className="rounded-lg border border-primary/10 bg-[linear-gradient(180deg,#ffffff_0%,#F8FAFC_100%)] p-5 shadow-premiumSm"
                initial={{ opacity: 0, y: 18 }}
                key={label}
                transition={{ delay: index * 0.08, duration: 0.45, ease: 'easeOut' }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Icon className="h-5 w-5 text-accent" />
                <span className="mt-4 block text-xs font-semibold uppercase text-primary/75">{label}</span>
                <strong className="mt-1 block font-heading text-xl text-primary">{value}</strong>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="group relative min-h-[380px] min-w-0 overflow-hidden rounded-lg border border-accent/25 bg-[radial-gradient(circle_at_50%_8%,#ffffff_0%,#F8FAFC_38%,#EAECF0_100%)] p-4 shadow-goldHairline [perspective:1200px] sm:min-h-[520px] sm:p-5"
          initial={{ opacity: 0, scale: 0.96 }}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-90px' }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
                    <div className="absolute left-1/2 top-1/2 h-[min(300px,74vw)] w-[min(300px,74vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10 sm:h-[390px] sm:w-[390px]" aria-hidden="true" />
          <div className="watch-orbit absolute left-1/2 top-1/2 h-[min(330px,80vw)] w-[min(330px,80vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accent/30 sm:h-[450px] sm:w-[450px]">
            <span className="absolute left-1/2 top-0 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black text-white shadow-premiumSm">
              <Activity className="h-5 w-5" />
            </span>
            <span className="absolute bottom-8 right-6 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black text-white shadow-premiumSm">
              <Hand className="h-4 w-4" />
            </span>
          </div>

          <motion.div
            className="absolute left-1/2 top-1/2 h-[min(310px,76vw)] w-[min(200px,50vw)] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] sm:h-[410px] sm:w-[250px]"
            style={{ rotateX, rotateY }}
          >
            <div className="absolute left-1/2 top-0 h-32 w-24 -translate-x-1/2 rounded-t-[42px] border border-white/15 bg-[linear-gradient(90deg,#050505,#d6d6d6_46%,#151515_58%,#020202)] shadow-premiumSm sm:h-40 sm:w-28" />
            <div className="absolute bottom-0 left-1/2 h-32 w-24 -translate-x-1/2 rounded-b-[42px] border border-white/15 bg-[linear-gradient(90deg,#020202,#151515_35%,#f2f2f2_48%,#050505)] shadow-premiumSm sm:h-40 sm:w-28" />
            <div className="absolute left-1/2 top-1/2 h-[min(224px,56vw)] w-[min(224px,56vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/30 bg-[radial-gradient(circle_at_35%_26%,#ffffff_0%,#bdbdbd_16%,#1a1a1a_50%,#030303_100%)] shadow-imageLift sm:h-72 sm:w-72">
              <div className="absolute inset-5 rounded-full border border-white/15 bg-[radial-gradient(circle_at_45%_35%,#f7f7f7_0%,#202020_30%,#030303_100%)] shadow-[inset_0_0_38px_rgba(255,255,255,0.2)]" />
              {dialMarkers.map((marker) => (
                <span
                  className="absolute left-1/2 top-1/2 h-2 w-px origin-[50%_5.9rem] bg-white/70 sm:origin-[50%_7.4rem]"
                  key={marker}
                  style={{ transform: `translate(-50%, -5.9rem) rotate(${marker * 30}deg)` }}
                />
              ))}
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-premiumSm" />
              <div className="watch-hand-sweep absolute left-1/2 top-1/2 h-px w-24 origin-left bg-white shadow-premiumSm" />
              <div className="absolute left-1/2 top-1/2 h-1 w-16 origin-left -translate-y-1/2 rounded-full bg-white [transform:rotate(38deg)]" />
              <div className="absolute left-1/2 top-1/2 h-1 w-12 origin-left -translate-y-1/2 rounded-full bg-white/75 [transform:rotate(128deg)]" />
              <div className="absolute -right-5 top-1/2 h-12 w-7 -translate-y-1/2 rounded-r-full border border-white/20 bg-[linear-gradient(90deg,#111,#f2f2f2,#111)]" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
