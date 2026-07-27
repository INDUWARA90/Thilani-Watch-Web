export const PolicyGrid = ({ items }) => (
  <section className="grid gap-4">
    {items.map((item) => (
      <article className="rounded-lg border border-white/12 bg-surface p-6 shadow-glowSm transition hover:border-white/30" key={item.title}>
        <div className="flex gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/10 text-white">
            <item.icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-heading text-lg font-bold text-white">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-white/70">{item.text}</p>
          </div>
        </div>
      </article>
    ))}
  </section>
)

