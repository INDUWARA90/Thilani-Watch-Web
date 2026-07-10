import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

export const DummyContent = ({ actionLabel, copy, eyebrow, title, to, variant = 'dark' }) => {
  const isLight = variant === 'light'

  return (
    <section 
      className={`relative overflow-hidden rounded-3xl p-8 sm:p-12 transition-all duration-300 ${
        isLight 
          ? 'border border-slate-100 bg-white text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.04)]' 
          : 'bg-slate-950 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]'
      }`}
    >
      {/* Structural Minimal Grid */}
      <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
        
        {/* Copy Column */}
        <div className="flex flex-col">
          <span className={`text-[10px] font-bold uppercase tracking-[0.25em] ${
            isLight ? 'text-amber-700' : 'text-amber-500'
          }`}>
            {eyebrow}
          </span>
          
          <h2 className="mt-3 mb-4 max-w-2xl text-3xl font-bold tracking-tight leading-tight sm:text-4xl">
            {title}
          </h2>
          
          <p className={`max-w-xl text-sm leading-relaxed ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            {copy}
          </p>
        </div>

        {/* Dynamic Context Interactivity Card Block */}
        <div 
          className={`rounded-2xl p-6 backdrop-blur-sm border transition-all duration-300 ${
            isLight 
              ? 'bg-slate-50/70 border-slate-100' 
              : 'bg-white/[0.03] border-white/[0.06] hover:border-white/10'
          }`}
        >
          {/* Accent Badge Row */}
          <div className="mb-6 flex flex-wrap gap-2">
            {['Classic', 'Modern', 'Premium'].map((item) => (
              <span 
                key={item}
                className={`flex-1 text-center rounded-xl py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  isLight 
                    ? 'bg-white border border-slate-200/60 text-slate-700 shadow-sm' 
                    : 'bg-white/[0.04] border border-white/[0.05] text-slate-300'
                }`}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Luxury Primary CTA Action Link */}
          <Link 
            className={`group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold uppercase tracking-wider no-underline transition-all duration-300 transform active:scale-98 ${
              isLight 
                ? 'bg-slate-950 text-white hover:bg-amber-600' 
                : 'bg-white text-slate-950 hover:bg-amber-500'
            }`} 
            to={to}
          >
            {actionLabel} 
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  )
}