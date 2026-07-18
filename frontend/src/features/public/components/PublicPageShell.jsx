import { Link } from 'react-router'

export const PublicPageShell = ({ children, eyebrow, text, title }) => (
  <main className="-mx-4 -mt-8 bg-white pb-20 sm:-mx-6 lg:-mx-8">
    <section className="relative overflow-hidden bg-[#F59600] px-4 pb-24 pt-14 text-white sm:px-6 sm:pb-28 sm:pt-16 lg:px-10">
      <div className="relative mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
        <div className="min-w-0">
          <p className="mb-4 inline-flex min-h-9 items-center rounded-full border border-white/35 bg-white/15 px-4 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">{eyebrow}</p>
          <h1 className="max-w-4xl text-[42px] font-black leading-[1.08] text-white sm:text-[58px]">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/85">{text}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className={orangeButtonClass} to="/watches">Shop watches</Link>
            <Link className={lightButtonClass} to="/contact">Contact shop</Link>
          </div>
        </div>
        <div className="w-full max-w-sm rounded-[28px] border border-orange-100 bg-white/70 p-4 shadow-[0_18px_55px_rgba(15,23,42,0.08)] sm:max-w-md lg:max-w-none">
          <div className="rounded-[22px] bg-white p-6 text-center shadow-sm">
            <img className="mx-auto h-28 w-28 rounded-full bg-[#121212] object-cover ring-4 ring-orange-100" src="/logo.jpeg" alt="Thilani Watch Center logo" />
            <p className="mt-5 text-3xl font-black text-[#121212]">Thilani</p>
            <p className="text-lg font-semibold text-[#F59600]">Watch Center</p>
          </div>
        </div>
      </div>
      <svg className="absolute bottom-[-1px] left-0 h-20 w-full text-white" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0 70L60 62.7C120 55 240 41 360 49.3C480 58 600 88 720 92.7C840 98 960 77 1080 63.3C1200 50 1320 44 1380 41.3L1440 39V120H0V70Z" />
      </svg>
    </section>

    <section className="relative z-10 mx-auto -mt-8 max-w-[1200px] px-4 sm:-mt-10 sm:px-6 lg:px-10">{children}</section>
  </main>
)

export const darkButtonClass = 'inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[#121212] px-6 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-[#272222] active:scale-[0.98]'
export const orangeButtonClass = 'inline-flex min-h-11 items-center justify-center rounded-[14px] bg-white px-6 text-sm font-semibold text-[#F59600] no-underline shadow-md shadow-orange-900/10 transition hover:bg-orange-50 active:scale-[0.98]'
export const lightButtonClass = 'inline-flex min-h-11 items-center justify-center rounded-[14px] border border-orange-200 bg-white px-6 text-sm font-semibold text-[#121212] no-underline shadow-sm transition hover:border-[#F59600] hover:text-[#F59600] active:scale-[0.98]'
