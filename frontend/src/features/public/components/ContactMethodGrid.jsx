export const ContactMethodGrid = ({ items }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {items.map((item) => (
      <a className="group rounded-[22px] border border-slate-100 bg-white p-6 text-[#121212] no-underline shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50/40 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]" href={item.href} key={`${item.label}-${item.text}`} rel="noreferrer" target={item.href.startsWith('http') ? '_blank' : undefined}>
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-[#F49006] transition group-hover:bg-[#F49006] group-hover:text-white">
          <item.icon className="h-5 w-5" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{item.label}</p>
        <p className="mt-2 text-base font-black text-[#121212]">{item.text}</p>
      </a>
    ))}
  </div>
)
