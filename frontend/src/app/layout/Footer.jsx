import { Link } from 'react-router'

export const Footer = () => (
  <footer className="mt-20 border-t border-slate-100 bg-white pt-12 pb-16 text-xs text-slate-400">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      {/* Footer Main Ledger Grid */}
      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold tracking-tight text-slate-900">
            Thilani Watch Web
          </span>
          <p className="max-w-sm leading-relaxed text-slate-400">
            Curated horology houses, elegant procurement architecture, and a highly refined transactional ecosystem from discovery to delivery.
          </p>
        </div>

        {/* Directory Columns */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-900">
            Explore Registry
          </span>
          <nav className="flex flex-col gap-2.5">
            <Link className="text-slate-400 no-underline transition-colors duration-200 hover:text-amber-700" to="/watches">
              All Timepieces
            </Link>
            <Link className="text-slate-400 no-underline transition-colors duration-200 hover:text-amber-700" to="/cart">
              Shopping Cart
            </Link>
            <Link className="text-slate-400 no-underline transition-colors duration-200 hover:text-amber-700" to="/wishlist">
              Personal Vault
            </Link>
          </nav>
        </div>

        {/* Brand Commitment Column */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-900">
            Client Concierge
          </span>
          <p className="leading-relaxed text-slate-400">
            Bespoke watch presentations, end-to-end encrypted account profiles, and live fulfillment tracking for every acquisition.
          </p>
        </div>

      </div>

      {/* Modern Horizontal Row Break & Copyright Base */}
      <div className="mt-12 border-t border-slate-50 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-[11px] font-medium text-slate-400">
        <p>&copy; {new Date().getFullYear()} Thilani Watch Web. All rights reserved.</p>
        <p className="text-slate-300">Certified Authentic Luxury Storefront</p>
      </div>

    </div>
  </footer>
)