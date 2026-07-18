import { Link } from 'react-router'
import { primaryLinkClass, secondaryLinkClass } from './StaticPageShell'

export const AboutIntro = () => (
  <section className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
      <div>
        <div className="mb-6 flex items-center gap-4">
          <img className="h-20 w-20 rounded-full bg-[#121212] object-cover ring-4 ring-orange-100" src="/logo.jpeg" alt="Thilani Watch Center logo" />
          <div>
            <p className="text-3xl font-black text-[#121212]">Thilani</p>
            <p className="text-lg font-semibold text-[#F49006]">Watch Center</p>
          </div>
        </div>
        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          Thilani Watch Center is a Sri Lankan watch storefront built for customers who want a clear, friendly, and confident buying experience. We bring product discovery, wishlist, checkout, payment slip upload, and order tracking together in one simple place.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className={primaryLinkClass} to="/watches">Shop watches</Link>
          <Link className={secondaryLinkClass} to="/contact">Contact us</Link>
        </div>
      </div>

      <div className="rounded-[24px] border border-orange-100 bg-orange-50/60 p-5">
        <div className="rounded-[20px] bg-white p-5 text-center shadow-sm">
          <img className="mx-auto h-auto max-h-52 w-full rounded-2xl object-contain" src="/logowithname.jpeg" alt="Thilani Watch Center logo with name" />
          <p className="mt-3 text-sm leading-6 text-slate-500">Premium watches, simple checkout, and friendly local support.</p>
        </div>
      </div>
    </div>
  </section>
)
