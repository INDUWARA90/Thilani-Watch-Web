import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export const FaqAccordion = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="grid gap-4">
        {items.map((item, index) => {
          const isOpen = activeIndex === index
          return (
            <article className="overflow-hidden rounded-[18px] border border-orange-100 bg-orange-50/40" key={item.question}>
              <button className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left transition hover:bg-orange-50/50" type="button" aria-expanded={isOpen} onClick={() => setActiveIndex(isOpen ? null : index)}>
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#F59600] shadow-sm">
                    <HelpCircle className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 text-base font-black text-[#121212]">{item.question}</span>
                </span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition ${isOpen ? 'rotate-180 text-[#F59600]' : ''}`} />
              </button>
              {isOpen && <p className="border-t border-slate-100 bg-white px-5 py-4 text-sm leading-7 text-slate-600">{item.answer}</p>}
            </article>
          )
        })}
      </div>
    </section>
  )
}

