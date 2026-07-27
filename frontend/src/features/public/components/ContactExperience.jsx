import { useEffect, useState } from 'react'
import { CheckCircle2, ExternalLink, Mail, MapPin, Phone, Send, X } from 'lucide-react'
import { ButtonSpinner } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { contactApi } from '@/features/public/api/contactApi'

const emptyForm = {
  email: '',
  message: '',
  name: '',
  phone: '',
  subject: '',
}

export const ContactExperience = ({ contacts, social }) => {
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')

  const updateField = (name, value) => {
    setError('')
    setStatus('')
    setForm((current) => ({ ...current, [name]: value }))
  }

  const submitForm = async (event) => {
    event.preventDefault()
    setError('')
    setStatus('')
    setIsSubmitting(true)

    try {
      const payload = await contactApi.submitContact({
        email: form.email.trim(),
        message: form.message.trim(),
        name: form.name.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
      })
      setStatus(payload?.message || 'Your message has been sent. The team will contact you soon.')
      setForm(emptyForm)
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to send your message.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const address = contacts.find((item) => item.label === 'Showroom')
  const email = contacts.find((item) => item.label === 'Email')
  const phones = contacts.filter((item) => item.label.toLowerCase().includes('phone'))

  return (
    <>
      <section className="mx-auto grid max-w-[1120px] items-start gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-12 lg:py-12">
        <ContactForm
          error={error}
          form={form}
          isSubmitting={isSubmitting}
          onChange={updateField}
          onSubmit={submitForm}
        />

        <aside className="grid gap-5 lg:sticky lg:top-24">
          <MapCard address={address} />
          <ShowroomCard address={address} email={email} phones={phones} social={social} />
        </aside>
      </section>
      <SuccessToast message={status} onClose={() => setStatus('')} />
    </>
  )
}

const ContactForm = ({ error, form, isSubmitting, onChange, onSubmit }) => (
  <form className="rounded-lg border border-primary/10 bg-card p-5 shadow-premiumSm sm:p-7" onSubmit={onSubmit}>
    <div className="mb-7">
      <h2 className="font-heading text-3xl font-bold leading-tight text-primary sm:text-[34px]">
        Send Us a <span className="">Message</span>
      </h2>
      <p className="mt-3 max-w-[450px] text-sm leading-6 text-primary">
        Have a question or inquiry? Fill out the form below and we'll get back to you as soon as possible.
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <FormField className="sm:col-span-2" label="Full Name" name="name" placeholder="John Doe" required value={form.name} onChange={onChange} />
      <FormField label="Email Address" name="email" placeholder="john@example.com" required type="email" value={form.email} onChange={onChange} />
      <FormField label="Phone Number" name="phone" placeholder="+94 00 000-0000" type="tel" value={form.phone} onChange={onChange} />

      <label className="grid gap-2 text-xs font-semibold text-primary sm:col-span-2">
        Subject *
        <select
          className={fieldClass}
          name="subject"
          required
          value={form.subject}
          onChange={(event) => onChange('subject', event.target.value)}
        >
          <option value="">Select a subject</option>
          <option value="Product inquiry">Product inquiry</option>
          <option value="Order support">Order support</option>
          <option value="Payment confirmation">Payment confirmation</option>
          <option value="Showroom visit">Showroom visit</option>
          <option value="Other">Other</option>
        </select>
      </label>
      
      <label className="grid gap-2 text-xs font-semibold text-primary sm:col-span-2">
        Message *
        <textarea
          className={`${fieldClass} min-h-[118px] resize-y py-3`}
          name="message"
          placeholder="Tell us how we can help you..."
          required
          value={form.message}
          onChange={(event) => onChange('message', event.target.value)}
        />
      </label>
    </div>

    {error && <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-200">{error}</p>}

    <button 
      className="mt-5 inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-6 text-xs font-bold uppercase text-primary shadow-premiumSm transition duration-200 hover:bg-accent/90 hover:shadow-premium focus:outline-none focus:ring-2 focus:ring-primary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60" 
      disabled={isSubmitting} 
      type="submit"
    >
      {isSubmitting ? 'Sending Message' : 'Send Message'}
      {isSubmitting ? <ButtonSpinner /> : <Send className="h-3.5 w-3.5" />}
    </button>
  </form>
)

const FormField = ({ className = '', label, name, onChange, placeholder, required = false, type = 'text', value }) => (
  <label className={`grid gap-2 text-xs font-semibold text-primary ${className}`}>
    {label}{required ? ' *' : ''}
    <input
      className={fieldClass}
      name={name}
      placeholder={placeholder}
      required={required}
      type={type}
      value={value}
      onChange={(event) => onChange(name, event.target.value)}
    />
  </label>
)

const SuccessToast = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return undefined

    const timer = window.setTimeout(onClose, 3500)
    return () => window.clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  return (
    <div className="fixed right-4 top-24 z-50 w-[calc(100%-2rem)] max-w-sm rounded-lg border border-primary/10 bg-card p-4 text-primary shadow-premium sm:right-6" role="status">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-emerald-200">
          <CheckCircle2 className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-primary">Message sent</p>
          <p className="mt-1 text-xs leading-5 text-primary">{message}</p>
        </div>
        <button className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-primary/60 transition duration-200 hover:bg-accent hover:text-primary" type="button" onClick={onClose} aria-label="Close message">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

const MapCard = ({ address }) => (
  <div className="overflow-hidden rounded-lg border border-primary/10 bg-card shadow-premiumSm">
    <div className="flex items-center justify-between gap-4 border-b border-primary/10 bg-card px-5 py-4">
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase text-primary/60">Store Location</p>
        <h3 className="truncate font-heading text-base font-semibold tracking-wide text-primary">Thilani Watch Centre</h3>
      </div>
      <a
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/15 text-primary transition duration-200 hover:border-accent hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent"
        href={address?.href || 'https://www.google.com/maps/search/?api=1&query=Thilani+Watch+Centre+Moratuwa'}
        rel="noreferrer"
        target="_blank"
        aria-label="Open directions"
      >
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
    <div className="relative h-[340px] bg-black sm:h-[390px] lg:h-[420px]">
      <iframe
        className="absolute inset-0 h-full w-full border-0"
        title="Thilani Watch Centre map"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps?q=Thilani%20Watch%20Centre%20Moratuwa&output=embed"
      />
    </div>
  </div>
)

const ShowroomCard = ({ address, email, phones, social }) => {
  return (
    <div className="rounded-lg border border-primary/10 bg-card p-6 text-primary shadow-premiumSm sm:p-7">
      <h3 className="font-heading text-xl font-bold text-primary">Visit Our Showroom</h3>
      <p className="mt-4 text-sm leading-6 text-primary">
        Experience our exclusive collection in person. Our expert consultants are ready to help you find the perfect timepiece.
      </p>

      <div className="mt-6 grid gap-4">
        <ContactLine
          icon={MapPin}
          label="Address"
          text={`No: 125 ${address?.text || 'New Galle Road, Moratuwa'}\nSri Lanka`}
          href={address?.href}
        />
        <ContactLine
          icon={Phone}
          label="Phone"
          text={phones.map((item) => item.text).join(' | ')}
          href={phones[0]?.href}
        />
        <ContactLine
          icon={Mail}
          label="Email"
          text={email?.text || 'thilaniwatchcenter@gmail.com'}
          href={email?.href}
        />
      </div>

      <p className="mt-7 text-[11px] font-semibold uppercase text-primary/60">Follow Us</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {social.map((item) => (
          <a
            aria-label={item.label}
            className="grid h-9 w-9 place-items-center rounded-full border border-primary/15 text-primary no-underline transition duration-200 hover:border-accent hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent"
            href={item.href}
            key={item.label}
            rel="noreferrer"
            target="_blank"
          >
            <item.icon aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        ))}
      </div>
    </div>
  )
}

const ContactLine = ({ href, icon: Icon, label, text }) => {
  const content = (
    <>
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
      <span>
        <span className="block text-sm font-semibold text-primary">{label}</span>
        <span className="mt-0.5 block whitespace-pre-line text-xs leading-5 text-primary">{text}</span>
      </span>
    </>
  )

  if (!href) {
    return <div className="flex gap-3">{content}</div>
  }

  return (
    <a className="flex gap-3 text-inherit no-underline transition duration-200 hover:text-accent" href={href} rel="noreferrer" target={href.startsWith('http') ? '_blank' : undefined}>
      {content}
    </a>
  )
}

const fieldClass = 'min-h-[40px] w-full rounded-lg border border-primary/15 bg-base px-4 text-sm font-medium text-primary outline-none transition duration-200 placeholder:text-primary/60 focus:border-accent focus:ring-2 focus:ring-accent/35'
