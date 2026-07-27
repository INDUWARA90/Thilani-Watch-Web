export const TrustStatStrip = ({ stats }) => (
  <section className="mb-8 grid items-stretch gap-4 md:grid-cols-3">
    {stats.map((item) => (
      <article className="flex min-h-28 items-center gap-4 rounded-lg border border-white/12 bg-surface p-5 shadow-glowSm" key={item.label}>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/10 text-white shadow-sm">
          <item.icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-heading text-2xl font-bold text-white">{item.value}</p>
          <p className="text-xs font-semibold uppercase text-white/75">{item.label}</p>
        </div>
      </article>
    ))}
  </section>
)

