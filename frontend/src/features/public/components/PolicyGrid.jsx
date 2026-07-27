export const PolicyGrid = ({ items }) => (
  <section className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
    {items.map((item) => (
      <article
        className="group relative overflow-hidden rounded-xl border border-primary/10 bg-card p-6 shadow-premiumSm transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-premium"
        key={item.title}
      >
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-accent shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:bg-accent group-hover:text-primary">
            <item.icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-heading text-lg font-bold tracking-tight text-primary">
                {item.title}
              </h2>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-primary/80 sm:text-sm">
              {item.text}
            </p>
          </div>
        </div>
      </article>
    ))}
  </section>
)
