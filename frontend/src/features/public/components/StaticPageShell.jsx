export const StaticPageShell = ({ children, eyebrow, title }) => (
  <main className="-mx-4 -mt-8 bg-white pb-20 sm:-mx-6 lg:-mx-8">
    <section className="relative overflow-hidden bg-[#121212] px-4 pb-28 pt-16 text-white sm:px-6 lg:px-10">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(244,144,6,0.95)_0%,rgba(235,150,14,0.75)_45%,rgba(18,18,18,0.9)_100%)]" />
      <div className="relative mx-auto max-w-[1200px]">
        <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
          <img className="h-12 w-12 rounded-full object-cover" src="/logo.jpeg" alt="Thilani Watch Center logo" />
        </div>
        <p className="mb-4 inline-flex min-h-9 items-center rounded-full border border-white/30 bg-white/10 px-4 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">{eyebrow}</p>
        <h1 className="max-w-4xl text-[42px] font-black leading-[1.08] text-white sm:text-[58px]">{title}</h1>
      </div>
      <svg className="absolute bottom-[-1px] left-0 h-20 w-full text-white" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0 70L60 62.7C120 55 240 41 360 49.3C480 58 600 88 720 92.7C840 98 960 77 1080 63.3C1200 50 1320 44 1380 41.3L1440 39V120H0V70Z" />
      </svg>
    </section>

    <section className="mx-auto -mt-10 max-w-[1200px] px-4 sm:px-6 lg:px-10">{children}</section>
  </main>
)

export const primaryLinkClass = 'inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[#121212] px-6 text-sm font-semibold text-white no-underline transition hover:bg-[#F49006]'
export const secondaryLinkClass = 'inline-flex min-h-11 items-center justify-center rounded-[14px] border border-slate-200 bg-white px-6 text-sm font-semibold text-[#121212] no-underline transition hover:border-[#F49006] hover:text-[#F49006]'
