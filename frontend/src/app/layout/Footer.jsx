import { Link } from 'react-router'

export const Footer = () => (
  <footer className="mt-20 bg-[#121212] px-4 py-12 text-white sm:px-6 lg:px-10">
    <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
      <div>
        <span className="text-xl font-extrabold text-white">Thilani Watch Web</span>
        <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
          A bright, modern storefront for premium watches, secure shopping, and clear order tracking from discovery to delivery.
        </p>
      </div>

      <div>
        <span className="text-sm font-normal text-white/70">Explore</span>
        <nav className="mt-4 grid gap-3">
          <FooterLink to="/watches">All Watches</FooterLink>
          <FooterLink to="/cart">Shopping Cart</FooterLink>
          <FooterLink to="/wishlist">Wishlist</FooterLink>
        </nav>
      </div>

      <div>
        <span className="text-sm font-normal text-white/70">Customer Care</span>
        <p className="mt-4 text-sm leading-6 text-white/75">
          Authentic watch presentation, simple checkout, and account tools built for confident buying.
        </p>
      </div>

      <div className="border-t border-white/15 pt-6 text-sm text-white/65 md:col-span-3 md:flex md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} Thilani Watch Web. All rights reserved.</p>
        <p className="mt-3 md:mt-0">Premium Watch Storefront</p>
      </div>
    </div>
  </footer>
)

const FooterLink = ({ children, to }) => (
  <Link className="text-sm text-white no-underline transition hover:text-[#F49006]" to={to}>
    {children}
  </Link>
)
