export const PolicyList = ({ items }) => (
  <section className="grid gap-4">
    {items.map((item, index) => (
      <article className="rounded-[22px] border border-slate-100 bg-white p-6 shadow-sm transition hover:border-orange-200 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]" key={item.title}>
        <div className="flex gap-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-sm font-black text-[#F49006]">{index + 1}</span>
          <div>
            <h2 className="text-lg font-black text-[#121212]">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
          </div>
        </div>
      </article>
    ))}
  </section>
)
