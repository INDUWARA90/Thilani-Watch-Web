import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export const FaqAccordion = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="rounded-lg border border-primary/10 bg-card p-5 shadow-premiumSm sm:p-8">
      <div className="grid gap-4">
        {items.map((item, index) => {
          const isOpen = activeIndex === index
          return (
            <article className="overflow-hidden rounded-lg border border-primary/10 bg-base" key={item.question}>
              <button className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left transition duration-200 hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent" type="button" aria-expanded={isOpen} onClick={() => setActiveIndex(isOpen ? null : index)}>
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-accent shadow-premiumSm">
                    <HelpCircle className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 font-heading text-base font-bold text-primary">{item.question}</span>
                </span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-primary transition ${isOpen ? 'rotate-180 text-accent' : ''}`} />
              </button>
              {isOpen && <p className="border-t border-primary/10 bg-card px-5 py-4 text-sm leading-7 text-primary">{item.answer}</p>}
            </article>
          )
        })}
      </div>
    </section>
  )
}

