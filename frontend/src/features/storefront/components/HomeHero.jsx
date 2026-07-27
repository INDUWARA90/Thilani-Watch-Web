import { ArrowRight, PlayCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { heroStats } from '@/features/storefront/lib/homeContent'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export const HomeHero = () => (
  <section className="relative overflow-hidden bg-base px-4 pb-24 pt-20 text-white sm:px-6 sm:pt-24 lg:px-10">
    <motion.div
      className="relative z-10 mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <div className="max-w-4xl">
        <motion.p variants={fadeUp} className="mb-5 inline-flex min-h-9 items-center rounded-full border border-white/15 bg-white/5 px-4 text-xs font-semibold uppercase text-white/75 backdrop-blur-sm">
          Luxury Watches
        </motion.p>
        <motion.h1 variants={fadeUp} className="font-heading text-[42px] font-bold leading-[1.02] text-white sm:text-[62px] lg:text-[82px]">
          Timeless watches for
          <span className="block text-white drop-shadow-[0_0_28px_rgba(255,255,255,0.55)]">every moment.</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
          Explore elegant timepieces for men, women, kids, and home spaces, curated with trusted brands, refined finishes, and secure islandwide delivery.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.03 }}>
            <Link
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-black no-underline shadow-glowSm transition hover:shadow-glow sm:w-auto"
            to="/watches"
            >
              Shop watches <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.03 }}>
            <Link
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 text-sm font-bold text-white no-underline backdrop-blur-sm transition hover:border-white/55 hover:bg-white/10 hover:shadow-glowSm sm:w-auto"
            to="/watches?featured=true"
            >
              <PlayCircle className="h-4 w-4" /> View featured
            </Link>
          </motion.div>
        </motion.div>
        <motion.div variants={fadeUp} className="mt-10 grid max-w-xl grid-cols-1 gap-3 min-[420px]:grid-cols-3">
          {heroStats.map((stat) => (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm" key={stat.label}>
              <strong className="block font-heading text-2xl font-bold text-white">{stat.value}</strong>
              <span className="mt-1 block text-xs font-medium text-white/65">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div variants={fadeUp} className="hidden lg:block">
        <HeroWatch3D />
      </motion.div>
    </motion.div>
    <div className="pointer-events-none absolute bottom-8 left-1/2 h-24 w-[min(980px,92vw)] -translate-x-1/2" aria-hidden="true">
      <div className="glow-beam absolute left-0 top-1/2 h-px w-full bg-white/70 shadow-glow" />
      <div className="glow-beam absolute left-1/2 top-4 h-28 w-[80%] -translate-x-1/2 rounded-[50%] border-t border-white/45" />
    </div>
  </section>
)

const HeroWatch3D = () => (
  <div className="relative mx-auto grid min-h-[430px] w-full place-items-center [perspective:1200px]" aria-hidden="true">
    <div className="absolute inset-x-8 bottom-10 h-14 rounded-full bg-white/25 blur-3xl" />
    <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/[0.03] shadow-glowSm" />

    <div className="watch-3d relative h-[390px] w-[230px] [transform-style:preserve-3d]">
      <div className="absolute left-1/2 top-0 h-32 w-24 -translate-x-1/2 rounded-t-[44px] border border-white/15 bg-[linear-gradient(90deg,#1a1a1a,#f4f4f4_44%,#151515_55%,#050505)] shadow-glowSm [transform:translateZ(-18px)]" />
      <div className="absolute left-1/2 bottom-0 h-32 w-24 -translate-x-1/2 rounded-b-[44px] border border-white/15 bg-[linear-gradient(90deg,#050505,#d8d8d8_44%,#151515_55%,#050505)] shadow-glowSm [transform:translateZ(-18px)]" />

      <div className="absolute left-1/2 top-[64px] h-64 w-64 -translate-x-1/2 rounded-full border border-white/20 bg-[radial-gradient(circle_at_35%_28%,#ffffff_0%,#cfcfcf_14%,#2d2d2d_42%,#050505_74%)] shadow-glow [transform:rotateY(-18deg)_rotateX(10deg)_translateZ(28px)]">
        <div className="absolute inset-4 rounded-full border border-black/50 bg-[radial-gradient(circle_at_50%_38%,#f7f7f7_0%,#c5c5c5_18%,#111_58%,#030303_100%)] shadow-[inset_0_0_36px_rgba(255,255,255,0.18)]" />
        <div className="absolute inset-8 rounded-full border border-white/20 bg-[radial-gradient(circle_at_35%_30%,#f5f5f5_0%,#202020_36%,#060606_100%)]" />

        <span className="absolute left-1/2 top-9 -translate-x-1/2 font-heading text-sm font-bold text-white">XII</span>
        <span className="absolute bottom-9 left-1/2 -translate-x-1/2 font-heading text-sm font-bold text-white/80">VI</span>
        <span className="absolute right-10 top-1/2 -translate-y-1/2 font-heading text-sm font-bold text-white/80">III</span>
        <span className="absolute left-10 top-1/2 -translate-y-1/2 font-heading text-sm font-bold text-white/80">IX</span>

        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-glowSm" />
        <div className="absolute left-1/2 top-1/2 h-1 w-20 origin-left -translate-y-1/2 rounded-full bg-white shadow-glowSm [transform:rotate(-28deg)]" />
        <div className="absolute left-1/2 top-1/2 h-1 w-14 origin-left -translate-y-1/2 rounded-full bg-white/80 [transform:rotate(92deg)]" />
        <div className="absolute left-1/2 top-1/2 h-px w-24 origin-left -translate-y-1/2 rounded-full bg-white/55 [transform:rotate(210deg)]" />

        <div className="absolute -right-5 top-1/2 h-12 w-7 -translate-y-1/2 rounded-r-full border border-white/15 bg-[linear-gradient(90deg,#333,#f5f5f5,#111)] shadow-glowSm" />
      </div>

      <div className="absolute left-1/2 top-[75px] h-60 w-60 -translate-x-1/2 rounded-full border-t border-white/65 opacity-70 blur-[1px]" />
    </div>
  </div>
)
