export const SocialPanel = ({ items }) => (
  <aside className="rounded-[24px] border border-slate-100 bg-[#121212] p-6 text-white shadow-[0_18px_55px_rgba(15,23,42,0.12)]">
    <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Follow us</p>
    <h2 className="mt-3 text-2xl font-black">Stay close to the store</h2>
    <p className="mt-3 text-sm leading-6 text-white/60">Message us for availability, delivery updates, and quick product questions.</p>
    <div className="mt-6 grid gap-3">
      {items.map((item) => (
        <a className="flex min-h-12 items-center gap-3 rounded-xl bg-white/10 px-4 text-sm font-semibold text-white no-underline transition hover:bg-[#F49006]" href={item.href} key={item.label} rel="noreferrer" target="_blank">
          <item.icon className="h-4 w-4" />
          {item.label}
        </a>
      ))}
    </div>
  </aside>
)
