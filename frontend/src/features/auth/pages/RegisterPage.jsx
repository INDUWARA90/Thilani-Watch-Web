import { useState } from 'react'
import { Eye } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { ButtonSpinner } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { useAuth } from '@/features/auth/hooks/useAuth'

export const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    }

    if (form.phone.trim()) {
      payload.phone = form.phone.trim()
    }

    try {
      if (!payload.name || !payload.email || !payload.password) {
        throw new Error('Name, email, and password are required.')
      }

      if (payload.password.length < 6) {
        throw new Error('Password must be at least 6 characters.')
      }

      await register(payload)
      navigate('/dashboard', { replace: true })
    } catch (apiError) {
      setError(apiError?.response ? getApiErrorMessage(apiError, 'Registration failed. Please check your details.') : apiError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-[760px] rounded-lg border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#8f6f10]">Create account</p>
      <h1 className="mb-4 text-4xl font-black leading-tight text-slate-950">Register</h1>
      <p className="mb-7 text-lg text-slate-600">Create a customer account with your contact details.</p>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Name
            <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-950 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15" name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Email
            <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-950 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15" name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Password
            <span className="flex items-center rounded-lg border border-slate-300 bg-white px-3 focus-within:border-[#D4AF37] focus-within:ring-4 focus-within:ring-[#D4AF37]/15">
              <input className="min-w-0 flex-1 py-3 text-slate-950 outline-none" name="password" type={showPassword ? 'text' : 'password'} value={form.password} minLength={6} onChange={handleChange} required />
              <button className="cursor-pointer text-slate-400 hover:text-[#8f6f10]" type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword((current) => !current)}>
                <Eye className="h-4 w-4" />
              </button>
            </span>
          </label>

          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Phone
            <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-950 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15" name="phone" type="tel" value={form.phone} onChange={handleChange} />
          </label>
        </div>

        <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent bg-slate-950 px-5 font-extrabold text-white transition hover:bg-[#D4AF37] hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-65" type="submit" disabled={isSubmitting}>
          {isSubmitting && <ButtonSpinner />} {isSubmitting ? 'Creating account' : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-slate-600">
        Already registered? <Link className="font-bold text-[#8f6f10] no-underline hover:underline" to="/login">Log in</Link>
      </p>
    </section>
  )
}
