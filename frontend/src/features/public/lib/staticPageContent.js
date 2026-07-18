import { BadgeCheck, Banknote, Clock3, Mail, MapPin, PackageCheck, Phone, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa'

export const contactItems = [
  { icon: MapPin, label: 'Showroom', text: 'New Gall Road, Moratuwa', href: 'https://www.google.com/maps/search/?api=1&query=New+Gall+Road%2C+Moratuwa' },
  { icon: Phone, label: 'Primary phone', text: '+94 78 9396 600', href: 'tel:+94789396600' },
  { icon: Phone, label: 'Support phone', text: '+94 78 890 7569', href: 'tel:+94788907569' },
  { icon: Mail, label: 'Email', text: 'thilaniwatchcenter@gmail.com', href: 'mailto:thilaniwatchcenter@gmail.com' },
]

export const socialItems = [
  { icon: FaFacebookF, label: 'Facebook', href: 'https://www.facebook.com/61573591756414' },
  { icon: FaWhatsapp, label: 'WhatsApp', href: 'https://wa.me/94788907569' },
]

export const aboutHighlights = [
  { icon: ShieldCheck, title: 'Authentic pieces', text: 'Every product page is built around clear details, real images, and customer confidence.' },
  { icon: Truck, title: 'Islandwide delivery', text: 'Secure delivery across Sri Lanka within 1-3 days after order processing.' },
  { icon: Banknote, title: 'Slip-based payment', text: 'Customers transfer to the listed bank account and attach a payment slip at checkout.' },
]

export const aboutSteps = [
  { title: 'Browse', text: 'Explore brands, categories, featured watches, new arrivals, and best sellers.' },
  { title: 'Choose', text: 'Save watches to wishlist, compare details, and add selected items to cart.' },
  { title: 'Confirm', text: 'Checkout with address details, bank transfer slip, and order tracking.' },
]

export const policyItems = [
  { icon: BadgeCheck, title: 'Product Information', text: 'We try to keep watch names, prices, stock, images, and descriptions accurate. Final availability is confirmed during order review.' },
  { icon: Banknote, title: 'Payment Review', text: 'Cash on delivery is not available. Orders use bank transfer with a required payment slip attachment.' },
  { icon: Truck, title: 'Delivery', text: 'Delivery is available across Sri Lanka. Most prepared orders are delivered within 1-3 days.' },
  { icon: PackageCheck, title: 'Returns', text: 'Return requests are reviewed based on order status, product condition, and the reason shared by the customer.' },
  { icon: ShieldCheck, title: 'Privacy', text: 'Customer contact, address, payment slip, and order information are used only for checkout, delivery, support, and admin review.' },
]

export const faqItems = [
  { question: 'How do I pay for my order?', answer: 'Transfer to one of the bank accounts shown at checkout, then upload a clear payment slip before placing the order.' },
  { question: 'Is cash on delivery available?', answer: 'No. Current orders use bank transfer with a payment slip attachment.' },
  { question: 'When does my slip upload to Cloudinary?', answer: 'Only when you click Place order. Selecting a file first only shows a local preview.' },
  { question: 'How long does delivery take?', answer: 'Most orders are delivered across Sri Lanka within 1-3 days after review and preparation.' },
  { question: 'How can I contact the shop?', answer: 'Use phone, email, Facebook, WhatsApp, or visit New Gall Road, Moratuwa.' },
]

export const trustStats = [
  { icon: Sparkles, label: 'Curated watches', value: '250+' },
  { icon: Clock3, label: 'Fast delivery', value: '1-3 days' },
  { icon: ShieldCheck, label: 'Local support', value: '2 phones' },
]

