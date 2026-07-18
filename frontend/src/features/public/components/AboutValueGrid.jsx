export const AboutValueGrid = ({ items }) => (
  <section className="mt-8 grid gap-5 md:grid-cols-3">
    {items.map((item) => (
      <article className="rounded-[22px] border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]" key={item.title}>
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-[#F49006]">
          <item.icon className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-black text-[#121212]">{item.title}</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
      </article>
    ))}
  </section>
)
