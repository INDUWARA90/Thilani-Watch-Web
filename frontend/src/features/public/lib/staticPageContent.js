import { Mail, MapPin, Phone, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa'

export const contactItems = [
  { icon: MapPin, label: 'Visit us', text: 'New Gall Road, Moratuwa', href: 'https://www.google.com/maps/search/?api=1&query=New+Gall+Road%2C+Moratuwa' },
  { icon: Phone, label: 'Call us', text: '+94 78 9396 600', href: 'tel:+94789396600' },
  { icon: Phone, label: 'Call us', text: '+94 78 890 7569', href: 'tel:+94788907569' },
  { icon: Mail, label: 'Email us', text: 'thilaniwatchcenter@gmail.com', href: 'mailto:thilaniwatchcenter@gmail.com' },
]

export const socialItems = [
  { icon: FaFacebookF, label: 'Facebook', href: 'https://www.facebook.com/61573591756414' },
  { icon: FaWhatsapp, label: 'WhatsApp', href: 'https://wa.me/94788907569' },
]

export const aboutValues = [
  { icon: ShieldCheck, title: 'Trusted watches', text: 'We focus on clear product details, quality checks, and honest customer guidance.' },
  { icon: Truck, title: 'Fast local delivery', text: 'Islandwide delivery across Sri Lanka within 1-3 days after order processing.' },
  { icon: Sparkles, title: 'Simple shopping', text: 'Browse, wishlist, checkout, upload payment proof, and order tracking in one clean flow.' },
]

export const policyItems = [
  { title: 'Product Information', text: 'We aim to show accurate watch details, prices, availability, images, and descriptions. Availability can change before checkout is completed.' },
  { title: 'Orders And Payment', text: 'Orders are processed after checkout details and the bank transfer payment slip are submitted. Admin review is required before payment is marked as paid.' },
  { title: 'Delivery', text: 'Delivery is available across Sri Lanka. Estimated delivery is usually 1-3 days after the order is reviewed and prepared.' },
  { title: 'Returns', text: 'Return requests may be reviewed based on order status, product condition, and the reason shared by the customer.' },
  { title: 'Privacy', text: 'Customer contact, address, and order information is used only to support account, checkout, delivery, and customer care workflows.' },
]

export const faqItems = [
  { question: 'How do I pay for my order?', answer: 'Use one of the bank accounts shown at checkout, then upload a clear payment slip before placing the order.' },
  { question: 'Is cash on delivery available?', answer: 'No. Current orders use bank transfer with a payment slip attachment.' },
  { question: 'How long does delivery take?', answer: 'Most orders are delivered across Sri Lanka within 1-3 days after order review and preparation.' },
  { question: 'Can I save watches before buying?', answer: 'Yes. Logged-in customers can use the wishlist and return later to compare selected watches.' },
  { question: 'Where can I contact the shop?', answer: 'You can call, email, WhatsApp, or visit us at New Gall Road, Moratuwa.' },
]
