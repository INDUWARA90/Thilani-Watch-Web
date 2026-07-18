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
  <footer className="mt-20 bg-[#121212] px-4 py-12 text-white sm:px-6 lg:px-10">
    <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[1.4fr_0.9fr_1.2fr_0.9fr]">
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
        <span className="text-sm font-normal text-white/70">Contact Us</span>
        <div className="mt-4 grid gap-3">
          {contactDetails.map((item) => (
            <FooterExternalLink href={item.href} key={item.label}>
              <item.icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#F49006]" />
              <span>{item.label}</span>
            </FooterExternalLink>
          ))}
        </div>
      </div>

      <div>
        <span className="text-sm font-normal text-white/70">Follow Us</span>
        <div className="mt-4 grid gap-3">
          {socialLinks.map((item) => (
            <FooterExternalLink href={item.href} key={item.label}>
              <item.icon aria-hidden="true" className="h-4 w-4 shrink-0 text-[#F49006]" />
              <span>{item.label}</span>
            </FooterExternalLink>
          ))}
        </div>
      </div>

      <div className="border-t border-white/15 pt-6 text-sm text-white/65 md:col-span-4 md:flex md:items-center md:justify-between">
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

const FooterExternalLink = ({ children, href }) => (
  <a
    className="flex items-start gap-2 text-sm text-white no-underline transition hover:text-[#F49006]"
    href={href}
    rel="noreferrer"
    target="_blank"
  >
    {children}
  </a>
)
