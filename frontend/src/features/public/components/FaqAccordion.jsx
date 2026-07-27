import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export const FaqAccordion = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="rounded-lg border border-white/12 bg-surface p-5 shadow-glowSm sm:p-8">
      <div className="grid gap-4">
        {items.map((item, index) => {
          const isOpen = activeIndex === index
          return (
            <article className="overflow-hidden rounded-lg border border-white/12 bg-white/[0.04]" key={item.question}>
              <button className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left transition hover:bg-white/[0.06]" type="button" aria-expanded={isOpen} onClick={() => setActiveIndex(isOpen ? null : index)}>
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10 text-white shadow-sm">
                    <HelpCircle className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 font-heading text-base font-bold text-white">{item.question}</span>
                </span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-white/75 transition ${isOpen ? 'rotate-180 text-white' : ''}`} />
              </button>
              {isOpen && <p className="border-t border-white/10 bg-black/20 px-5 py-4 text-sm leading-7 text-white/70">{item.answer}</p>}
            </article>
          )
        })}
      </div>
    </section>
  )
}

