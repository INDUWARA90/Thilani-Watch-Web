import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export const HomeHero = () => (
  <section className="relative -mt-[72px] min-h-[calc(100vh+72px)] overflow-hidden bg-[linear-gradient(135deg,#000000_0%,#111111_48%,#000000_100%)] px-4 pb-24 pt-36 text-white sm:-mt-[92px] sm:min-h-[calc(100vh+92px)] sm:px-6 sm:pb-28 sm:pt-44 lg:px-10">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_42%,rgba(245,197,24,0.11),transparent_30%),linear-gradient(90deg,rgba(0,0,0,0.14),transparent_44%)]" aria-hidden="true" />
    <div className="pointer-events-none absolute left-10 top-28 hidden font-heading text-[180px] font-bold leading-none text-white/[0.022] lg:block" aria-hidden="true">
      TW
    </div>
    <motion.div
      className="relative z-10 mx-auto grid min-h-[calc(100vh-120px)] max-w-[1200px] gap-14 lg:grid-cols-[minmax(0,0.84fr)_minmax(380px,0.68fr)] lg:items-center"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <div className="max-w-3xl">
        <motion.p variants={fadeUp} className="mb-7 inline-flex min-h-9 items-center border-b border-accent/70 px-0 pb-2 text-xs font-bold uppercase tracking-[0.28em] text-accent">
          Limited Edition
        </motion.p>
        <motion.h1 variants={fadeUp} className="font-heading text-[56px] font-bold leading-[0.9] tracking-wide text-white sm:text-[84px] lg:text-[112px]">
          Time, held with precision.
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-8 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
          Explore elegant timepieces for men, women, kids, and home spaces, curated with trusted brands, refined finishes, and secure islandwide delivery.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.03 }}>
            <Link
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-9 text-xs font-bold uppercase tracking-[0.18em] text-primary no-underline shadow-goldHairline transition duration-300 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-luxe focus:outline-none focus:ring-2 focus:ring-accent sm:w-auto"
            to="/watches"
            >
              Discover Watches <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} className="hidden lg:block">
        <HeroWatch3D />
      </motion.div>
    </motion.div>
    <div className="pointer-events-none absolute bottom-8 left-1/2 h-24 w-[min(980px,92vw)] -translate-x-1/2" aria-hidden="true">
      <div className="absolute left-0 top-1/2 h-px w-full bg-accent/35" />
      <div className="absolute left-1/2 top-4 h-28 w-[80%] -translate-x-1/2 rounded-[50%] border-t border-accent/20" />
    </div>
  </section>
)

const HeroWatch3D = () => (
  <div className="relative mx-auto grid min-h-[560px] w-full place-items-center [perspective:1200px]" aria-hidden="true">
    <div className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/12 bg-[radial-gradient(circle,rgba(245,197,24,0.10),rgba(255,255,255,0.045)_42%,transparent_70%)] shadow-luxe" />

    <div className="watch-3d relative h-[470px] w-[280px] [transform-style:preserve-3d]">
      <div className="absolute left-1/2 top-0 h-32 w-24 -translate-x-1/2 rounded-t-[44px] border border-white/15 bg-[linear-gradient(90deg,#1a1a1a,#f4f4f4_44%,#151515_55%,#050505)] shadow-premiumSm [transform:translateZ(-18px)]" />
      <div className="absolute left-1/2 bottom-0 h-32 w-24 -translate-x-1/2 rounded-b-[44px] border border-white/15 bg-[linear-gradient(90deg,#050505,#d8d8d8_44%,#151515_55%,#050505)] shadow-premiumSm [transform:translateZ(-18px)]" />

      <div className="absolute left-1/2 top-[86px] h-72 w-72 -translate-x-1/2 rounded-full border border-accent/30 bg-[radial-gradient(circle_at_35%_28%,#ffffff_0%,#cfcfcf_14%,#2d2d2d_42%,#050505_74%)] shadow-imageLift [transform:rotateY(-18deg)_rotateX(10deg)_translateZ(28px)]">
        <div className="absolute inset-4 rounded-full border border-black/50 bg-[radial-gradient(circle_at_50%_38%,#f7f7f7_0%,#c5c5c5_18%,#111_58%,#030303_100%)] shadow-[inset_0_0_36px_rgba(255,255,255,0.18)]" />
        <div className="absolute inset-8 rounded-full border border-white/20 bg-[radial-gradient(circle_at_35%_30%,#f5f5f5_0%,#202020_36%,#060606_100%)]" />

        <span className="absolute left-1/2 top-9 -translate-x-1/2 font-heading text-sm font-bold text-white">XII</span>
        <span className="absolute bottom-9 left-1/2 -translate-x-1/2 font-heading text-sm font-bold text-white/80">VI</span>
        <span className="absolute right-10 top-1/2 -translate-y-1/2 font-heading text-sm font-bold text-white/80">III</span>
        <span className="absolute left-10 top-1/2 -translate-y-1/2 font-heading text-sm font-bold text-white/80">IX</span>

        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-premiumSm" />
        <div className="absolute left-1/2 top-1/2 h-1 w-20 origin-left -translate-y-1/2 rounded-full bg-white shadow-premiumSm [transform:rotate(-28deg)]" />
        <div className="absolute left-1/2 top-1/2 h-1 w-14 origin-left -translate-y-1/2 rounded-full bg-white/80 [transform:rotate(92deg)]" />
        <div className="absolute left-1/2 top-1/2 h-px w-24 origin-left -translate-y-1/2 rounded-full bg-white/55 [transform:rotate(210deg)]" />

        <div className="absolute -right-5 top-1/2 h-12 w-7 -translate-y-1/2 rounded-r-full border border-white/15 bg-[linear-gradient(90deg,#333,#f5f5f5,#111)] shadow-premiumSm" />
      </div>

      <div className="absolute left-1/2 top-[75px] h-60 w-60 -translate-x-1/2 rounded-full border-t border-white/65 opacity-70 blur-[1px]" />
    </div>
  </div>
)
