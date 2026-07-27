export const TrustStatStrip = ({ stats }) => (
  <section className="mb-8 grid items-stretch gap-4 md:grid-cols-3">
    {stats.map((item) => (
      <article 
        className="group relative flex min-h-24 items-center gap-4 overflow-hidden rounded-xl border border-primary/10 bg-card p-5 shadow-premiumSm transition-all duration-300 hover:border-accent/40 hover:shadow-premium" 
        key={item.label}
      >
        {/* Subtle Accent Glow Bar on Hover */}
        <div className="absolute left-0 top-0 h-full w-1 bg-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-primary/10 bg-primary/5 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-accent">
          <item.icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-heading text-2xl font-bold tracking-tight text-primary">
            {item.value}
          </p>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary/70">
            {item.label}
          </p>
        </div>
      </article>
    ))}
  </section>
)