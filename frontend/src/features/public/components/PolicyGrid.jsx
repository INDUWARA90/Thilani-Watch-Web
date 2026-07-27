export const PolicyGrid = ({ items }) => (
  <section className="grid gap-4">
    {items.map((item) => (
      <article className="rounded-lg border border-primary/10 bg-card p-6 shadow-premiumSm transition duration-200 hover:-translate-y-1 hover:border-accent/60 hover:shadow-premium" key={item.title}>
        <div className="flex gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary text-accent">
            <item.icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-heading text-lg font-bold text-primary">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-primary">{item.text}</p>
          </div>
        </div>
      </article>
    ))}
  </section>
)

