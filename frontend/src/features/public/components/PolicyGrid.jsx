export const PolicyGrid = ({ items }) => (
  <section className="grid gap-4">
    {items.map((item) => (
      <article className="rounded-[22px] border border-orange-100 bg-white p-6 shadow-sm transition hover:bg-orange-50/30 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]" key={item.title}>
        <div className="flex gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#F59600,#F59600)] text-white">
            <item.icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-black text-[#121212]">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
          </div>
        </div>
      </article>
    ))}
  </section>
)

