import { Link } from 'react-router'
import { lightButtonClass, orangeButtonClass } from './PublicPageShell'

export const AboutBrandSection = () => (
  <section className="rounded-lg border border-primary/10 bg-card p-6 shadow-premiumSm sm:p-8">
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
      <div className="min-w-0">
        <div className="mb-6 flex items-center gap-4">
          <img className="h-20 w-20 rounded-full bg-white object-cover ring-4 ring-white/10" src="/logo.jpeg" alt="Thilani Watch Center logo" />
          <div>
            <p className="font-heading text-3xl font-bold text-primary">Thilani</p>
            <p className="text-lg font-semibold text-primary">Watch Center</p>
          </div>
        </div>
        <h2 className="max-w-2xl font-heading text-3xl font-bold leading-tight text-primary sm:text-4xl">A local watch store experience built for confident online buying.</h2>
        <p className="mt-5 max-w-3xl text-base leading-8 text-primary">
          Thilani Watch Center brings browsing, wishlist, cart, bank-transfer checkout, payment slip upload, and order tracking into one clean customer journey.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className={orangeButtonClass} to="/watches">Browse watches</Link>
          <Link className={lightButtonClass} to="/faq">Read FAQ</Link>
        </div>
      </div>
      <div className="w-full max-w-md rounded-lg border border-primary/10 bg-base p-5 lg:max-w-none">
        <div className="rounded-lg border border-white/10 bg-primary p-6 text-center shadow-premiumSm">
          <img className="mx-auto h-32 w-32 rounded-full bg-white object-cover ring-4 ring-white/10" src="/logo.jpeg" alt="Thilani Watch Center logo" />
          <p className="mt-5 font-heading text-3xl font-bold text-white">Thilani</p>
          <p className="text-lg font-semibold text-white/70">Watch Center</p>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/65">Premium watches, simple checkout, and friendly local support.</p>
        </div>
      </div>
    </div>
  </section>
)

