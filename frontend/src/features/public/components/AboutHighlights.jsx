export const AboutHighlights = ({ items, steps }) => (
  <>
    <section className="mt-8 grid items-stretch gap-5 md:grid-cols-3">
      {items.map((item) => (
        <article className="min-h-56 rounded-lg border border-white/12 bg-surface p-6 shadow-glowSm transition hover:-translate-y-1 hover:border-white/30" key={item.title}>
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-white/10 text-white">
            <item.icon className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-white">{item.title}</h3>
          <p className="mt-2 text-sm leading-7 text-white/70">{item.text}</p>
        </article>
      ))}
    </section>

    <section className="mt-8 rounded-lg border border-white/12 bg-surface p-6 text-white shadow-glowSm sm:p-8">
      <p className="text-xs font-bold uppercase text-white/65">Customer journey</p>
      <h2 className="mt-3 font-heading text-3xl font-bold">From first look to delivery update</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <article className="min-h-44 rounded-lg border border-white/12 bg-black/25 p-5 shadow-sm" key={step.title}>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-sm font-black text-black">{index + 1}</span>
            <h3 className="mt-4 font-heading text-lg font-bold">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  </>
)

