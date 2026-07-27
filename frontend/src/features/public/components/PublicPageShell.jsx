import { Link } from 'react-router'

export const PublicPageShell = ({ children, eyebrow, text, title }) => (
  <main className="min-h-screen bg-base pb-20 text-black">
    {/* Editorial Split Header */}
    <section className="relative overflow-hidden border-b border-primary/10 bg-base px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        
        {/* Main Grid: Brand Banner + Hero Copy */}
        <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-center lg:gap-12">
          
          {/* Column 1: Compact Brand Badge */}
          <div className="w-full rounded-2xl border border-primary/10 bg-card p-2 shadow-premiumSm sm:max-w-xs lg:max-w-none">
            <div className="flex flex-row items-center gap-4 rounded-xl border border-primary/10 bg-primary p-4 text-white lg:flex-col lg:p-6 lg:text-center">
              <img 
                className="h-16 w-16 shrink-0 rounded-full border-2 border-white/20 bg-white object-cover shadow-sm lg:h-20 lg:w-20" 
                src="/logo.jpeg" 
                alt="Thilani Watch Center logo" 
              />
              <div>
                <p className="font-heading text-xl font-bold tracking-tight lg:text-2xl">Thilani</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Watch Center</p>
              </div>
            </div>
          </div>

          {/* Column 2: Header & Content */}
          <div className="min-w-0">
            <h1 className="max-w-3xl break-words font-heading text-3xl font-extrabold leading-[1.1] text-primary sm:text-4xl lg:text-5xl">
              {title}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary/80 sm:text-lg">
              {text}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link className={orangeButtonClass} to="/watches">
                Shop watches
              </Link>
              <Link className={lightButtonClass} to="/contact">
                Contact shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Main Page Children */}
    <section className="relative z-10 mx-auto max-w-[1200px] px-4 pt-10 sm:px-6 lg:px-10">
      {children}
    </section>
  </main>
)

/* Button Utility Exports */
export const darkButtonClass = 'inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-white no-underline shadow-premiumSm transition duration-200 hover:bg-primary/85 hover:shadow-premium focus:outline-none focus:ring-2 focus:ring-accent active:scale-[0.98]'
export const orangeButtonClass = 'inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-bold text-primary no-underline shadow-premiumSm transition duration-200 hover:bg-accent/90 hover:shadow-premium focus:outline-none focus:ring-2 focus:ring-primary active:scale-[0.98]'
export const lightButtonClass = 'inline-flex min-h-11 items-center justify-center rounded-full border border-primary/15 bg-card px-6 text-sm font-bold text-primary no-underline shadow-premiumSm transition duration-200 hover:border-accent hover:text-accent hover:shadow-premium focus:outline-none focus:ring-2 focus:ring-accent active:scale-[0.98]'