export const PublicIntroPanel = ({ children, kicker, title }) => (
  <section className="mb-8 rounded-lg border border-white/12 bg-surface p-6 shadow-glowSm sm:p-8">
    <p className="text-xs font-bold uppercase text-white/65">{kicker}</p>
    <h2 className="mt-3 max-w-3xl font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">{title}</h2>
    <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">{children}</p>
  </section>
)

