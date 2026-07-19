import { useState } from 'react'
import { Send } from 'lucide-react'
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

  return (
    <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="grid gap-6">
        <ContactForm 
          error={error} 
          form={form} 
          isSubmitting={isSubmitting} 
          status={status} 
          onChange={updateField} 
          onSubmit={submitForm} 
        />
        
        {/* Contact Links Grid */}
        <div className="grid items-stretch gap-4 sm:grid-cols-2">
          {contacts.map((item) => (
            <a 
              className="group flex min-h-[160px] flex-col rounded-[20px] border border-gray-200 bg-white p-6 text-[#121212] no-underline shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-all duration-300 hover:-translate-y-1 hover:border-gray-900 hover:shadow-[0_12px_30px_rgba(0,0,0,0.05)]" 
              href={item.href} 
              key={`${item.label}-${item.text}`} 
              rel="noreferrer" 
              target={item.href.startsWith('http') ? '_blank' : undefined}
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gray-50 border border-gray-100 text-[#121212] transition-colors duration-300 group-hover:bg-gray-900 group-hover:text-white">
                <item.icon className="h-4 w-4" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.label}</p>
              <p className="mt-1.5 break-words text-base font-bold text-[#121212] tracking-tight">{item.text}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Editorial Dark Minimalist Sidebar */}
      <aside className="rounded-[24px] bg-gradient-to-b from-[#1c1c1e] to-[#121212] p-6 sm:p-8 text-white shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Concierge Desk</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight leading-snug font-serif">Fast help for watch buyers</h2>
        <p className="mt-3 text-xs leading-relaxed text-gray-400 font-light">
          Ask about immediate stock availability, worldwide secure courier delivery, payment validations, or specific showroom pieces.
        </p>
        
        <div className="mt-8 grid gap-2.5">
          {social.map((item) => (
            <a 
              className="flex min-h-[46px] items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-medium tracking-wide text-gray-200 no-underline transition-all duration-200 hover:bg-white hover:text-[#121212] hover:border-white" 
              href={item.href} 
              key={item.label} 
              rel="noreferrer" 
              target="_blank"
            >
              <item.icon className="h-4 w-4 shrink-0 opacity-80" />
              {item.label}
            </a>
          ))}
        </div>
      </aside>
    </section>
  )
}

const ContactForm = ({ error, form, isSubmitting, onChange, onSubmit, status }) => (
  <form className="rounded-[24px] border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)]" onSubmit={onSubmit}>
    <div className="mb-6">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Direct Inquiries</p>
      <h2 className="mt-1 text-2xl font-bold text-[#121212] tracking-tight">Contact Form</h2>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Name" name="name" required value={form.name} onChange={onChange} />
      <FormField label="Email" name="email" required type="email" value={form.email} onChange={onChange} />
      <FormField label="Phone" name="phone" type="tel" value={form.phone} onChange={onChange} />
      <FormField label="Subject" name="subject" value={form.subject} onChange={onChange} />
      
      <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-500 sm:col-span-2">
        Message
        <textarea
          className={`${fieldClass} min-h-[120px] resize-y py-3 rounded-xl`}
          name="message"
          required
          value={form.message}
          onChange={(event) => onChange('message', event.target.value)}
        />
      </label>
    </div>

    {error && <p className="mt-4 rounded-xl border border-red-100 bg-red-50/50 px-4 py-3 text-xs font-medium text-red-600">{error}</p>}
    {status && <p className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-xs font-medium text-emerald-600">{status}</p>}

    <button 
      className="mt-6 inline-flex min-h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#121212] px-6 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit" 
      disabled={isSubmitting} 
      type="submit"
    >
      {isSubmitting ? <ButtonSpinner /> : <Send className="h-3.5 w-3.5" />}
      {isSubmitting ? 'Sending Message' : 'Send Message'}
    </button>
  </form>
)

const FormField = ({ label, name, onChange, required = false, type = 'text', value }) => (
  <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">
    {label}
    <input
      className={fieldClass}
      name={name}
      required={required}
      type={type}
      value={value}
      onChange={(event) => onChange(name, event.target.value)}
    />
  </label>
)

const fieldClass = 'min-h-[44px] w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-medium text-[#121212] outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-950/5'
