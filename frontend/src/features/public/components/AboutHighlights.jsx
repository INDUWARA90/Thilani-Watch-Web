export const AboutHighlights = ({ items, steps }) => (
  <>
    <section className="mt-8 grid items-stretch gap-5 md:grid-cols-3">
      {items.map((item) => (
        <article className="min-h-56 rounded-lg border border-primary/10 bg-card p-6 shadow-premiumSm transition duration-200 hover:-translate-y-1 hover:border-accent/60 hover:shadow-premium" key={item.title}>
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-primary text-accent">
            <item.icon className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-primary">{item.title}</h3>
          <p className="mt-2 text-sm leading-7 text-primary">{item.text}</p>
        </article>
      ))}
    </section>

    <section className="mt-8 rounded-lg border border-primary/10 bg-card p-6 text-primary shadow-premiumSm sm:p-8">
      <p className="text-xs font-bold uppercase text-primary">Customer journey</p>
      <h2 className="mt-3 font-heading text-3xl font-bold">From first look to delivery update</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <article className="min-h-44 rounded-lg border border-primary/10 bg-base p-5 shadow-premiumSm" key={step.title}>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-sm font-black text-primary">{index + 1}</span>
            <h3 className="mt-4 font-heading text-lg font-bold">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-primary">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  </>
)

