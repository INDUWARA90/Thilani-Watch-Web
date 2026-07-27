export const PublicIntroPanel = ({ children, kicker, title }) => (
  <section className="mb-8 rounded-lg border border-primary/10 bg-card p-6 shadow-premiumSm sm:p-8">
    <p className="text-xs font-bold uppercase text-primary">{kicker}</p>
    <h2 className="mt-3 max-w-3xl font-heading text-3xl font-bold leading-tight text-primary sm:text-4xl">{title}</h2>
    <p className="mt-4 max-w-3xl text-sm leading-7 text-primary">{children}</p>
  </section>
)

