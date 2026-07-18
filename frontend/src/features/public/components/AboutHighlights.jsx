export const AboutHighlights = ({ items, steps }) => (
  <>
    <section className="mt-8 grid items-stretch gap-5 md:grid-cols-3">
      {items.map((item) => (
        <article className="min-h-56 rounded-[22px] border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-orange-50/30 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]" key={item.title}>
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,#F59600,#F59600)] text-white">
            <item.icon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-black text-[#121212]">{item.title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
        </article>
      ))}
    </section>

    <section className="mt-8 rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#FFF7ED_0%,#FFE7C2_100%)] p-6 text-[#121212] shadow-sm sm:p-8">
      <p className="text-xs font-bold uppercase tracking-wide text-[#F59600]">Customer journey</p>
      <h2 className="mt-3 text-3xl font-black">From first look to delivery update</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <article className="min-h-44 rounded-[18px] border border-orange-100 bg-white p-5 shadow-sm" key={step.title}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F59600] text-sm font-black text-white">{index + 1}</span>
            <h3 className="mt-4 text-lg font-black">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  </>
)

