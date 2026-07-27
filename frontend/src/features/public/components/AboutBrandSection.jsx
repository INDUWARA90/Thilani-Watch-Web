import { Link } from 'react-router'
import { lightButtonClass, orangeButtonClass } from './PublicPageShell'

export const AboutBrandSection = () => (
  <section className="rounded-xl border border-primary/10 bg-card p-6 shadow-premiumSm sm:p-10">
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
      {/* Left Main Content */}
      <div className="min-w-0">
        <div className="mb-6 inline-flex items-center gap-3">
          <img 
            className="h-14 w-14 rounded-full border border-primary/15 bg-white object-cover p-0.5 shadow-sm" 
            src="/logo.jpeg" 
            alt="Thilani Watch Center logo" 
          />
          <div>
            <p className="font-heading text-xl font-bold leading-none text-primary">Thilani</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">Watch Center</p>
          </div>
        </div>

        <h2 className="max-w-2xl font-heading text-3xl font-extrabold leading-tight tracking-tight text-primary sm:text-4xl">
          A local watch store experience built for confident online buying.
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary/80">
          Thilani Watch Center brings browsing, wishlist, cart, bank-transfer checkout, payment slip upload, and order tracking into one clean customer journey.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link className={orangeButtonClass} to="/watches">Browse watches</Link>
          <Link className={lightButtonClass} to="/faq">Read FAQ</Link>
        </div>
      </div>

      {/* Right Service Commitment Card */}
      <div className="w-full rounded-xl border border-primary/10 bg-primary p-6 text-white shadow-premiumSm">
        <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-accent">Our Promise</p>
        <h3 className="mt-1 font-heading text-xl font-bold text-white">Why Shop With Us</h3>

        <ul className="mt-5 space-y-3.5 text-xs text-white/80">
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-primary">✓</span>
            <span><strong>Verified Authenticity:</strong> Every piece carefully inspected before listing.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-primary">✓</span>
            <span><strong>Seamless Checkout:</strong> Direct bank transfer with instant slip upload verification.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-primary">✓</span>
            <span><strong>Live Order Tracking:</strong> Track your watch status from dispatch to delivery.</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
)