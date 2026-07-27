import { MapPin, Mail, Phone } from 'lucide-react'
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa'
import { Link } from 'react-router'

const contactDetails = [
  {
    label: 'New Gall Road, Moratuwa',
    href: 'https://www.google.com/maps/search/?api=1&query=New+Gall+Road%2C+Moratuwa',
    icon: MapPin,
  },
  {
    label: '+94 78 9396 600',
    href: 'tel:+94789396600',
    icon: Phone,
  },
  {
    label: '+94 78 890 7569',
    href: 'tel:+94788907569',
    icon: Phone,
  },
  {
    label: 'thilaniwatchcenter@gmail.com',
    href: 'mailto:thilaniwatchcenter@gmail.com',
    icon: Mail,
  },
]

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/61573591756414',
    icon: FaFacebookF,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/94788907569',
    icon: FaWhatsapp,
  },
]

export const Footer = () => (
  <footer className="relative bg-[linear-gradient(180deg,#050505_0%,#000000_100%)] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-10">
    <div className="absolute left-1/2 top-0 h-px w-[min(920px,86vw)] -translate-x-1/2 bg-accent/55" />
    <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-[1.45fr_0.85fr_1.15fr_0.85fr]">
      <div className="max-w-sm">
        <div className="flex items-center gap-3">
          <img
            alt="Thilani Watch Center logo"
            className="h-14 w-14 rounded-full bg-white object-cover ring-1 ring-accent/35"
            src="/logo.jpeg"
          />
          <span className="font-heading text-2xl font-bold tracking-wide text-white">Thilani Watch Web</span>
        </div>
        <p className="mt-6 text-sm leading-7 text-white/62">
          A bright, modern storefront for premium watches, secure shopping, and clear order tracking from discovery to delivery.
        </p>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Explore</span>
        <nav className="mt-5 grid gap-3">
          <FooterLink to="/watches">All Watches</FooterLink>
          <FooterLink to="/about">About Us</FooterLink>
          <FooterLink to="/contact">Contact Us</FooterLink>
          <FooterLink to="/faq">FAQ</FooterLink>
          <FooterLink to="/policy">Policy</FooterLink>
          <FooterLink to="/cart">Shopping Cart</FooterLink>
          <FooterLink to="/wishlist">Wishlist</FooterLink>
        </nav>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Contact Us</span>
        <div className="mt-5 grid gap-3">
          {contactDetails.map((item) => (
            <FooterExternalLink href={item.href} key={item.label}>
              <item.icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent/75" />
              <span>{item.label}</span>
            </FooterExternalLink>
          ))}
        </div>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Follow Us</span>
        <div className="mt-5 grid gap-3">
          {socialLinks.map((item) => (
            <FooterExternalLink href={item.href} key={item.label}>
              <item.icon aria-hidden="true" className="h-4 w-4 shrink-0 text-accent/75" />
              <span>{item.label}</span>
            </FooterExternalLink>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 pt-7 text-xs font-semibold uppercase tracking-[0.18em] text-white/45 md:col-span-4 md:flex md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} Thilani Watch Web. All rights reserved.</p>
        <p className="mt-3 md:mt-0">Premium Watch Storefront</p>
      </div>
    </div>
  </footer>
)

const FooterLink = ({ children, to }) => (
  <Link className="text-sm text-white/64 no-underline transition duration-300 hover:translate-x-1 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent" to={to}>
    {children}
  </Link>
)

const FooterExternalLink = ({ children, href }) => (
  <a
    className="flex items-start gap-2 text-sm leading-6 text-white/64 no-underline transition duration-300 hover:translate-x-1 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
    href={href}
    rel="noreferrer"
    target="_blank"
  >
    {children}
  </a>
)
