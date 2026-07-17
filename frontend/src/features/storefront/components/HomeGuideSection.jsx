import { guideSteps } from '@/features/storefront/lib/homeContent'

export const HomeGuideSection = () => (
  <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-10">
    <div className="rounded-[20px] border border-[#DEE2E6] bg-[#F8F9FA] p-5 sm:p-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#F49006]">Buying guide</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-[#121212] sm:text-4xl">Pick with confidence</h2>
        <p className="mt-3 text-sm leading-7 text-[#6C757D] sm:text-base">
          A simple guide helps customers understand the practical details before they add a watch to cart.
        </p>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {guideSteps.map(({ icon: Icon, title, text }) => (
          <article className="rounded-[16px] border border-[#DEE2E6] bg-white p-5" key={title}>
            <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#121212] text-[#F49006]">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-xl font-black text-[#121212]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6C757D]">{text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
)
