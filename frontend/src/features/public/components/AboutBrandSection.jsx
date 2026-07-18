import { Link } from 'react-router'
import { lightButtonClass, orangeButtonClass } from './PublicPageShell'

export const AboutBrandSection = () => (
  <section className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
      <div className="min-w-0">
        <div className="mb-6 flex items-center gap-4">
          <img className="h-20 w-20 rounded-full bg-[#121212] object-cover ring-4 ring-orange-100" src="/logo.jpeg" alt="Thilani Watch Center logo" />
          <div>
            <p className="text-3xl font-black text-[#121212]">Thilani</p>
            <p className="text-lg font-semibold text-[#F59600]">Watch Center</p>
          </div>
        </div>
        <h2 className="max-w-2xl text-3xl font-black leading-tight text-[#121212] sm:text-4xl">A local watch store experience built for confident online buying.</h2>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Thilani Watch Center brings browsing, wishlist, cart, bank-transfer checkout, payment slip upload, and order tracking into one clean customer journey.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className={orangeButtonClass} to="/watches">Browse watches</Link>
          <Link className={lightButtonClass} to="/faq">Read FAQ</Link>
        </div>
      </div>
      <div className="w-full max-w-md rounded-[24px] border border-orange-100 bg-orange-50/70 p-5 lg:max-w-none">
        <div className="rounded-[18px] bg-white p-6 text-center shadow-sm">
          <img className="mx-auto h-32 w-32 rounded-full bg-[#121212] object-cover ring-4 ring-orange-100" src="/logo.jpeg" alt="Thilani Watch Center logo" />
          <p className="mt-5 text-3xl font-black text-[#121212]">Thilani</p>
          <p className="text-lg font-semibold text-[#F59600]">Watch Center</p>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-500">Premium watches, simple checkout, and friendly local support.</p>
        </div>
      </div>
    </div>
  </section>
)

