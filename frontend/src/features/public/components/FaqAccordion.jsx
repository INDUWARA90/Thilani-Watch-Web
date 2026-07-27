import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export const FaqAccordion = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="rounded-xl border border-primary/10 bg-card p-5 shadow-premiumSm sm:p-8">
      <div className="grid gap-3.5">
        {items.map((item, index) => {
          const isOpen = activeIndex === index
          return (
            <article 
              className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                isOpen 
                  ? 'border-accent/50 bg-base shadow-premiumSm' 
                  : 'border-primary/10 bg-base/60 hover:border-primary/25 hover:bg-base'
              }`} 
              key={item.question}
            >
              <button 
                className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left focus:outline-none focus:ring-2 focus:ring-accent/50" 
                type="button" 
                aria-expanded={isOpen} 
                onClick={() => setActiveIndex(isOpen ? null : index)}
              >
                <span className="flex min-w-0 items-center gap-3.5">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg transition-colors duration-300 ${
                    isOpen ? 'bg-accent text-primary' : 'bg-primary/5 text-primary'
                  }`}>
                    <HelpCircle className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 font-heading text-black font-bold text-black sm:text-lg">
                    {item.question}
                  </span>
                </span>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-transform duration-300 ${
                  isOpen ? 'rotate-180 bg-accent/15 text-accent' : 'text-primary/60'
                }`}>
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>

              <div className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}>
                <div className="overflow-hidden">
                  <p className="border-t border-primary/10 bg-card/80 px-6 py-5 text-sm leading-relaxed text-primary/85 sm:text-black">
                    {item.answer}
                  </p>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}