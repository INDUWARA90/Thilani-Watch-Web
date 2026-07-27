export const PublicIntroPanel = ({ children, kicker, title }) => (
  <section className="relative mb-8 overflow-hidden rounded-xl border border-primary/10 bg-card p-6 shadow-premiumSm sm:p-8">
    {kicker && (
      <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-base px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {kicker}
      </div>
    )}

    <h2 className="max-w-3xl font-heading text-2xl font-bold leading-tight text-black sm:text-3xl lg:text-4xl">
      {title}
    </h2>

    <div className="mt-4 max-w-3xl text-sm leading-relaxed text-primary/80 sm:text-black">
      {children}
    </div>
  </section>
)