export const AboutHighlights = ({ items, steps }) => (
  <>
    {/* Highlights Grid */}
    <section className="mt-8 grid items-stretch gap-5 md:grid-cols-3">
      {items.map((item) => (
        <article 
          className="group relative flex min-h-56 flex-col justify-between overflow-hidden rounded-xl border border-primary/10 bg-card p-6 shadow-premiumSm transition duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-premium" 
          key={item.title}
        >
          {/* Subtle Top Accent Hairline */}
          <div className="absolute inset-x-0 top-0 h-1 bg-primary/10 transition-colors duration-300 group-hover:bg-accent" />

          <div>
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-primary text-accent shadow-premiumSm transition duration-300 group-hover:scale-105">
              <item.icon className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-xl font-bold tracking-tight text-primary">
              {item.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-primary/80">
              {item.text}
            </p>
          </div>
        </article>
      ))}
    </section>

    {/* Customer Journey Section */}
    <section className="mt-10 overflow-hidden rounded-xl border border-primary/10 bg-card p-6 text-primary shadow-premiumSm sm:p-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-md border border-primary/15 bg-base px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Customer Journey
          </span>
          <h2 className="mt-3 font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">
            From first look to delivery update
          </h2>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <article 
            className="relative flex flex-col justify-between rounded-xl border border-primary/10 bg-base p-6 shadow-premiumSm transition duration-200 hover:border-primary/25" 
            key={step.title}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-sm font-black text-primary shadow-premiumSm">
                  0{index + 1}
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary/40">
                  STEP
                </span>
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-primary/80">
                {step.text}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  </>
)