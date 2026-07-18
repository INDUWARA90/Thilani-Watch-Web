export const ContactExperience = ({ contacts, social }) => (
  <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
    <div className="grid items-stretch gap-4 sm:grid-cols-2">
      {contacts.map((item) => (
        <a className="group flex min-h-44 flex-col rounded-[22px] border border-orange-100 bg-white p-6 text-[#121212] no-underline shadow-sm transition hover:-translate-y-1 hover:bg-orange-50/40 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]" href={item.href} key={`${item.label}-${item.text}`} rel="noreferrer" target={item.href.startsWith('http') ? '_blank' : undefined}>
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-[#F59600] transition group-hover:bg-[#F59600] group-hover:text-white">
            <item.icon className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{item.label}</p>
          <p className="mt-2 break-words text-base font-black text-[#121212]">{item.text}</p>
        </a>
      ))}
    </div>

    <aside className="rounded-[24px] border border-orange-100 bg-[linear-gradient(135deg,#FFF7ED_0%,#FFE1AD_100%)] p-6 text-[#121212] shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#F59600]">Follow us</p>
      <h2 className="mt-3 text-2xl font-black">Fast help for watch buyers</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">Ask about stock, delivery, payment slip review, or a watch you saw in the storefront.</p>
      <div className="mt-6 grid gap-3">
        {social.map((item) => (
          <a className="flex min-h-12 items-center gap-3 rounded-xl bg-white px-4 text-sm font-semibold text-[#121212] no-underline shadow-sm transition hover:bg-[#F59600] hover:text-white" href={item.href} key={item.label} rel="noreferrer" target="_blank">
            <item.icon className="h-4 w-4" />
            {item.label}
          </a>
        ))}
      </div>
    </aside>
  </section>
)

