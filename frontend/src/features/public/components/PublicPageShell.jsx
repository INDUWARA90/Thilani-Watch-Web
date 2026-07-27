import { Link } from 'react-router'

export const PublicPageShell = ({ children, eyebrow, text, title }) => (
  <main className="bg-base pb-20 text-primary">
    <section className="relative overflow-hidden bg-base px-4 pb-28 pt-20 text-primary sm:px-6 sm:pt-24 lg:px-10">
      <div className="relative mx-auto grid max-w-[1200px] min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
        <div className="min-w-0">
          <p className="mb-4 inline-flex min-h-9 items-center rounded-full border border-primary/15 bg-card px-4 text-xs font-semibold uppercase text-primary shadow-premiumSm">{eyebrow}</p>
          <h1 className="max-w-4xl break-words font-heading text-[40px] font-bold leading-[1.05] text-primary sm:text-[58px]">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-primary">{text}</p>
          <div className="mt-7 grid gap-3 min-[420px]:flex min-[420px]:flex-wrap">
            <Link className={orangeButtonClass} to="/watches">Shop watches</Link>
            <Link className={lightButtonClass} to="/contact">Contact shop</Link>
          </div>
        </div>
        <div className="w-full max-w-sm rounded-lg border border-primary/10 bg-card p-4 shadow-premiumSm sm:max-w-md lg:max-w-none">
          <div className="rounded-lg border border-primary/10 bg-primary p-6 text-center shadow-premiumSm">
            <img className="mx-auto h-28 w-28 rounded-full bg-white object-cover ring-4 ring-white/10" src="/logo.jpeg" alt="Thilani Watch Center logo" />
            <p className="mt-5 font-heading text-3xl font-bold text-white">Thilani</p>
            <p className="text-lg font-semibold text-white/70">Watch Center</p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-8 left-1/2 h-24 w-[min(980px,92vw)] -translate-x-1/2" aria-hidden="true">
        <div className="absolute left-0 top-1/2 h-px w-full bg-primary/15" />
        <div className="absolute left-1/2 top-4 h-28 w-[80%] -translate-x-1/2 rounded-[50%] border-t border-primary/10" />
      </div>
    </section>

    <section className="relative z-10 mx-auto max-w-[1200px] px-4 pt-12 sm:px-6 lg:px-10">{children}</section>
  </main>
)

export const darkButtonClass = 'inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-white no-underline shadow-premiumSm transition duration-200 hover:bg-primary/85 hover:shadow-premium focus:outline-none focus:ring-2 focus:ring-accent active:scale-[0.98]'
export const orangeButtonClass = 'inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-bold text-primary no-underline shadow-premiumSm transition duration-200 hover:bg-accent/90 hover:shadow-premium focus:outline-none focus:ring-2 focus:ring-primary active:scale-[0.98]'
export const lightButtonClass = 'inline-flex min-h-11 items-center justify-center rounded-full border border-primary/15 bg-card px-6 text-sm font-bold text-primary no-underline shadow-premiumSm transition duration-200 hover:border-accent hover:text-accent hover:shadow-premium focus:outline-none focus:ring-2 focus:ring-accent active:scale-[0.98]'
