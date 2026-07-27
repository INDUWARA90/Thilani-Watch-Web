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
  const glowX = useTransform(smoothX, [-0.5, 0.5], ['18%', '82%'])
  const glowY = useTransform(smoothY, [-0.5, 0.5], ['18%', '82%'])

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
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.01))] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/10" aria-hidden="true" />
      <div className="mx-auto grid max-w-[1200px] min-w-0 gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1fr)] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-90px' }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <p className="inline-flex min-h-8 items-center rounded-full border border-white/15 bg-white/5 px-3 text-xs font-semibold uppercase text-white/75">
            Signature showcase
          </p>
          <h2 className="mt-4 max-w-2xl font-heading text-3xl font-bold leading-tight text-white sm:text-5xl">
            See the shine, depth, and detail up close.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
            Move across the dial to experience polished metal, layered glass, and soft silver highlights inspired by premium watch craftsmanship.
          </p>

          <div className="mt-7 grid min-w-0 gap-3 sm:grid-cols-3 lg:max-w-xl">
            {highlights.map(({ icon: Icon, label, value }, index) => (
              <motion.div
                className="rounded-lg border border-white/12 bg-white/[0.045] p-4 shadow-glowSm backdrop-blur-sm"
                initial={{ opacity: 0, y: 18 }}
                key={label}
                transition={{ delay: index * 0.08, duration: 0.45, ease: 'easeOut' }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Icon className="h-5 w-5 text-white" />
                <span className="mt-4 block text-xs font-semibold uppercase text-white/60">{label}</span>
                <strong className="mt-1 block font-heading text-xl text-white">{value}</strong>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="group relative min-h-[380px] min-w-0 overflow-hidden rounded-lg border border-white/12 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),rgba(255,255,255,0.035)_38%,rgba(255,255,255,0.02)_100%)] p-4 shadow-glowSm [perspective:1200px] sm:min-h-[520px] sm:p-5"
          initial={{ opacity: 0, scale: 0.96 }}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-90px' }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="pointer-events-none absolute h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl"
            style={{ left: glowX, top: glowY }}
          />
          <div className="absolute inset-x-10 bottom-16 h-16 rounded-full bg-white/20 blur-3xl" aria-hidden="true" />
          <div className="absolute left-1/2 top-1/2 h-[min(300px,74vw)] w-[min(300px,74vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 sm:h-[390px] sm:w-[390px]" aria-hidden="true" />
          <div className="watch-orbit absolute left-1/2 top-1/2 h-[min(330px,80vw)] w-[min(330px,80vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15 sm:h-[450px] sm:w-[450px]">
            <span className="absolute left-1/2 top-0 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black text-white shadow-glowSm">
              <Activity className="h-5 w-5" />
            </span>
            <span className="absolute bottom-8 right-6 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black text-white shadow-glowSm">
              <Hand className="h-4 w-4" />
            </span>
          </div>

          <motion.div
            className="absolute left-1/2 top-1/2 h-[min(310px,76vw)] w-[min(200px,50vw)] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] sm:h-[410px] sm:w-[250px]"
            style={{ rotateX, rotateY }}
          >
            <div className="absolute left-1/2 top-0 h-32 w-24 -translate-x-1/2 rounded-t-[42px] border border-white/15 bg-[linear-gradient(90deg,#050505,#d6d6d6_46%,#151515_58%,#020202)] shadow-glowSm sm:h-40 sm:w-28" />
            <div className="absolute bottom-0 left-1/2 h-32 w-24 -translate-x-1/2 rounded-b-[42px] border border-white/15 bg-[linear-gradient(90deg,#020202,#151515_35%,#f2f2f2_48%,#050505)] shadow-glowSm sm:h-40 sm:w-28" />
            <div className="absolute left-1/2 top-1/2 h-[min(224px,56vw)] w-[min(224px,56vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-[radial-gradient(circle_at_35%_26%,#ffffff_0%,#bdbdbd_16%,#1a1a1a_50%,#030303_100%)] shadow-glow sm:h-72 sm:w-72">
              <div className="absolute inset-5 rounded-full border border-white/15 bg-[radial-gradient(circle_at_45%_35%,#f7f7f7_0%,#202020_30%,#030303_100%)] shadow-[inset_0_0_38px_rgba(255,255,255,0.2)]" />
              {dialMarkers.map((marker) => (
                <span
                  className="absolute left-1/2 top-1/2 h-2 w-px origin-[50%_5.9rem] bg-white/70 sm:origin-[50%_7.4rem]"
                  key={marker}
                  style={{ transform: `translate(-50%, -5.9rem) rotate(${marker * 30}deg)` }}
                />
              ))}
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-glowSm" />
              <div className="watch-hand-sweep absolute left-1/2 top-1/2 h-px w-24 origin-left bg-white shadow-glowSm" />
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
