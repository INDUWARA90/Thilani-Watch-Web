export const TrustStatStrip = ({ stats }) => (
  <section className="mb-8 grid items-stretch gap-4 md:grid-cols-3">
    {stats.map((item) => (
      <article className="flex min-h-28 items-center gap-4 rounded-lg border border-primary/10 bg-card p-5 shadow-premiumSm" key={item.label}>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary text-accent shadow-premiumSm">
          <item.icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-heading text-2xl font-bold text-primary">{item.value}</p>
          <p className="text-xs font-semibold uppercase text-primary">{item.label}</p>
        </div>
      </article>
    ))}
  </section>
)

