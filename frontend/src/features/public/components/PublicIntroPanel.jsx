export const PublicIntroPanel = ({ children, kicker, title }) => (
  <section className="mb-8 rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#FFFFFF_0%,#FFF7ED_100%)] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
    <p className="text-xs font-bold uppercase tracking-wide text-[#F59600]">{kicker}</p>
    <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-[#121212] sm:text-4xl">{title}</h2>
    <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{children}</p>
  </section>
)

