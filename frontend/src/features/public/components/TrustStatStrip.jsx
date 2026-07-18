export const TrustStatStrip = ({ stats }) => (
  <section className="mb-8 grid items-stretch gap-4 md:grid-cols-3">
    {stats.map((item) => (
      <article className="flex min-h-28 items-center gap-4 rounded-[20px] border border-orange-100 bg-orange-50/60 p-5 shadow-sm" key={item.label}>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[#F59600] shadow-sm">
          <item.icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-2xl font-black text-[#121212]">{item.value}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.label}</p>
        </div>
      </article>
    ))}
  </section>
)

