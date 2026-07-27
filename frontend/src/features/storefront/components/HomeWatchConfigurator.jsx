import { useState } from 'react'
import { Check, CircleGauge, Gem, ScanLine, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const finishes = [
  {
    name: 'Midnight Steel',
    strap: 'bg-[linear-gradient(90deg,#050505,#303030_42%,#d8d8d8_52%,#0b0b0b)]',
    dial: 'bg-[radial-gradient(circle_at_36%_28%,#ffffff_0%,#8f8f8f_12%,#171717_46%,#020202_100%)]',
    ring: 'border-white/40',
  },
  {
    name: 'Silver Classic',
    strap: 'bg-[linear-gradient(90deg,#111,#f6f6f6_46%,#7b7b7b_58%,#050505)]',
    dial: 'bg-[radial-gradient(circle_at_35%_25%,#ffffff_0%,#d8d8d8_20%,#2a2a2a_55%,#050505_100%)]',
    ring: 'border-white/65',
  },
  {
    name: 'Graphite Sport',
    strap: 'bg-[linear-gradient(90deg,#020202,#161616_35%,#707070_50%,#050505)]',
    dial: 'bg-[radial-gradient(circle_at_42%_28%,#e8e8e8_0%,#686868_15%,#101010_48%,#000_100%)]',
    ring: 'border-white/25',
  },
]

const specs = [
  { label: 'Comfort', value: 88 },
  { label: 'Polish', value: 76 },
  { label: 'Durability', value: 94 },
]

const notes = [
  { icon: ShieldCheck, text: 'Selected with reliable warranty support.' },
  { icon: Gem, text: 'Glass-like shine with a premium dial finish.' },
  { icon: ScanLine, text: 'Compare the case, dial, and strap feel.' },
]

export const HomeWatchConfigurator = () => {
  const [activeFinish, setActiveFinish] = useState(finishes[0])

  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" aria-hidden="true" />
      <div className="mx-auto grid max-w-[1200px] min-w-0 gap-10 lg:grid-cols-[minmax(360px,0.95fr)_minmax(0,1fr)] lg:items-center">
        <motion.div
          className="relative min-h-[380px] min-w-0 overflow-hidden rounded-lg border border-white/12 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.13),rgba(255,255,255,0.045)_42%,rgba(0,0,0,0.3)_100%)] shadow-glowSm [perspective:1300px] sm:min-h-[500px]"
          initial={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-90px' }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div className="absolute inset-x-12 bottom-16 h-16 rounded-full bg-white/20 blur-3xl" aria-hidden="true" />
          <div className="absolute left-1/2 top-1/2 h-[min(300px,74vw)] w-[min(300px,74vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/[0.025] sm:h-[360px] sm:w-[360px]" aria-hidden="true" />
          <div className="config-turntable absolute left-1/2 top-[54%] h-10 w-[min(290px,74vw)] -translate-x-1/2 rounded-[50%] border border-white/15 bg-white/[0.03] shadow-glowSm sm:h-12 sm:w-[360px]" />

          <motion.div
            animate={{ rotateY: [0, -12, 10, 0], y: [0, -8, 0] }}
            className="absolute left-1/2 top-1/2 h-[min(340px,82vw)] w-[min(210px,52vw)] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] sm:h-[410px] sm:w-[250px]"
            key={activeFinish.name}
            transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
          >
            <div className={`absolute left-1/2 top-0 h-32 w-24 -translate-x-1/2 rounded-t-[42px] border border-white/15 ${activeFinish.strap} shadow-glowSm sm:h-40 sm:w-28`} />
            <div className={`absolute bottom-0 left-1/2 h-32 w-24 -translate-x-1/2 rounded-b-[42px] border border-white/15 ${activeFinish.strap} shadow-glowSm sm:h-40 sm:w-28`} />
            <div className={`absolute left-1/2 top-1/2 h-[min(240px,60vw)] w-[min(240px,60vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border ${activeFinish.ring} ${activeFinish.dial} shadow-glow sm:h-72 sm:w-72`}>
              <div className="absolute inset-5 rounded-full border border-white/20 bg-black/35 shadow-[inset_0_0_34px_rgba(255,255,255,0.2)]" />
              <div className="absolute inset-10 rounded-full border border-white/10 bg-[radial-gradient(circle_at_50%_32%,rgba(255,255,255,0.24),rgba(255,255,255,0.04)_42%,rgba(0,0,0,0.4)_100%)]" />
              <span className="absolute left-1/2 top-9 -translate-x-1/2 font-heading text-sm font-bold text-white">XII</span>
              <span className="absolute bottom-9 left-1/2 -translate-x-1/2 font-heading text-sm font-bold text-white/80">VI</span>
              <span className="absolute right-10 top-1/2 -translate-y-1/2 font-heading text-sm font-bold text-white/80">III</span>
              <span className="absolute left-10 top-1/2 -translate-y-1/2 font-heading text-sm font-bold text-white/80">IX</span>
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-glowSm" />
              <div className="absolute left-1/2 top-1/2 h-1 w-20 origin-left -translate-y-1/2 rounded-full bg-white shadow-glowSm [transform:rotate(-18deg)]" />
              <div className="absolute left-1/2 top-1/2 h-1 w-14 origin-left -translate-y-1/2 rounded-full bg-white/75 [transform:rotate(92deg)]" />
              <div className="config-glint absolute inset-0 rounded-full" />
              <div className="absolute -right-5 top-1/2 h-12 w-7 -translate-y-1/2 rounded-r-full border border-white/20 bg-[linear-gradient(90deg,#111,#f5f5f5,#101010)]" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative z-10 rounded-lg border border-white/10 bg-black/35 p-4 shadow-glowSm backdrop-blur-sm sm:p-0 sm:shadow-none sm:border-0 sm:bg-transparent sm:backdrop-blur-0"
          initial={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-90px' }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <p className="inline-flex min-h-8 items-center rounded-full border border-white/25 bg-white/10 px-3 text-xs font-bold uppercase text-white shadow-glowSm">
            Style preview
          </p>
          <h2 className="mt-4 max-w-2xl break-words font-heading text-3xl font-bold leading-tight text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.24)] sm:text-5xl">
            Choose a finish that matches your style.
          </h2>
          <p className="mt-4 max-w-xl rounded-lg border border-white/12 bg-black/55 px-4 py-3 text-sm font-semibold leading-7 text-white shadow-[0_0_18px_rgba(255,255,255,0.12)] sm:text-base">
            Preview refined steel, silver, and graphite-inspired looks before exploring watches made for formal wear, gifting, and daily use.
          </p>

          <div className="mt-7 grid gap-3">
            {finishes.map((finish) => {
              const isActive = finish.name === activeFinish.name

              return (
                <motion.button
                  className={`flex min-h-16 w-full items-center justify-between rounded-lg border px-4 text-left transition ${
                    isActive ? 'border-white/55 bg-white/15 shadow-glowSm' : 'border-white/20 bg-black/45 hover:border-white/40 hover:bg-white/[0.08]'
                  }`}
                  key={finish.name}
                  onClick={() => setActiveFinish(finish)}
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className={`h-9 w-9 shrink-0 rounded-full border border-white/30 ${finish.dial}`} />
                    <span className="min-w-0">
                      <span className="block break-words font-heading text-base font-bold text-white">{finish.name}</span>
                      <span className="block text-xs font-semibold text-white/85">Tap to preview finish</span>
                    </span>
                  </span>
                  {isActive && <Check className="h-5 w-5 shrink-0 text-white" />}
                </motion.button>
              )
            })}
          </div>

          <div className="mt-6 rounded-lg border border-white/20 bg-black/55 p-5 shadow-glowSm">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md border border-white/12 bg-white/5">
                <CircleGauge className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase text-white/85">Style score</p>
                <h3 className="font-heading text-xl font-bold text-white">Premium daily profile</h3>
              </div>
            </div>
            <div className="grid gap-4">
              {specs.map((spec) => (
                <div key={spec.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-white">{spec.label}</span>
                    <span className="font-semibold text-white/85">{spec.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-white shadow-glowSm"
                      initial={{ width: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      viewport={{ once: true }}
                      whileInView={{ width: `${spec.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {notes.map(({ icon: Icon, text }) => (
              <div className="rounded-lg border border-white/18 bg-black/45 p-4 shadow-glowSm" key={text}>
                <Icon className="h-5 w-5 text-white" />
                <p className="mt-3 text-xs font-medium leading-5 text-white/90">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
