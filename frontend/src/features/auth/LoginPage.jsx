import { useState } from 'react'
import { Eye, LockKeyhole, Mail } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'
import { getApiErrorMessage } from '../../lib/apiClient'
import { useAuth } from './useAuth'

export const LoginPage = () => {
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (!form.email.trim() || !form.password) {
        throw new Error('Email and password are required.')
      }

      await login({
        email: form.email.trim(),
        password: form.password,
      })
      navigate(redirectTo, { replace: true })
    } catch (apiError) {
      setError(apiError?.response ? getApiErrorMessage(apiError, 'Login failed. Check your email and password.') : apiError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-[520px] rounded-lg border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#8f6f10]">Welcome back</p>
        <Link
          className="inline-flex min-h-10 w-fit items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-extrabold text-slate-700 no-underline transition hover:border-[#D4AF37] hover:text-[#8f6f10]"
          to="/"
        >
          Visit Store
        </Link>
      </div>
      <h1 className="mb-4 text-4xl font-black leading-tight text-slate-950">Log in</h1>
      <p className="mb-7 text-lg text-slate-600">Access your account, saved addresses, wishlist, and orders.</p>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}

        <label className="grid gap-2 text-sm font-extrabold text-slate-700">
          Email
          <span className="flex items-center rounded-lg border border-slate-300 bg-white px-3 focus-within:border-[#D4AF37] focus-within:ring-4 focus-within:ring-[#D4AF37]/15">
            <Mail className="h-4 w-4 text-slate-400" />
            <input className="min-w-0 flex-1 px-3 py-3 text-slate-950 outline-none" name="email" type="email" value={form.email} onChange={handleChange} required />
          </span>
        </label>

        <label className="grid gap-2 text-sm font-extrabold text-slate-700">
          Password
          <span className="flex items-center rounded-lg border border-slate-300 bg-white px-3 focus-within:border-[#D4AF37] focus-within:ring-4 focus-within:ring-[#D4AF37]/15">
            <LockKeyhole className="h-4 w-4 text-slate-400" />
            <input className="min-w-0 flex-1 px-3 py-3 text-slate-950 outline-none" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} required />
            <button className="cursor-pointer text-slate-400 hover:text-[#8f6f10]" type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword((current) => !current)}>
              <Eye className="h-4 w-4" />
            </button>
          </span>
        </label>

        <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center rounded-lg border border-transparent bg-slate-950 px-5 font-extrabold text-white transition hover:bg-[#D4AF37] hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-65" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-5 text-slate-600">
        New to Thilani Watch Web? <Link className="font-bold text-[#8f6f10] no-underline hover:underline" to="/register">Create an account</Link>
      </p>
    </section>
  )
}
