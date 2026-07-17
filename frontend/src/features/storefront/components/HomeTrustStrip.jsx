import { trustItems } from '@/features/storefront/lib/homeContent'

export const HomeTrustStrip = () => (
  <section className="mx-auto grid max-w-[1200px] gap-4 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
    {trustItems.map(({ icon: Icon, label, text }) => (
      <article className="rounded-[16px] border border-[#DEE2E6] bg-white p-5 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.04)]" key={label}>
        <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#F49006]/10 text-[#F49006]">
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="mt-4 text-lg font-black text-[#121212]">{label}</h2>
        <p className="mt-2 text-sm leading-6 text-[#6C757D]">{text}</p>
      </article>
    ))}
  </section>
)
