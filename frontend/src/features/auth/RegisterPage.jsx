import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { getApiErrorMessage } from '../../lib/apiClient'
import { useAuth } from './useAuth'

export const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    <section className="mx-auto w-full max-w-[760px] rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(28,41,56,0.08)] sm:p-8">
      <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-teal-700">Create account</p>
      <h1 className="mb-4 text-4xl font-bold leading-tight text-slate-950">Register</h1>
      <p className="mb-7 text-lg text-slate-600">Create a customer account with your contact details.</p>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Name
            <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Email
            <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Password
            <input
              className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15"
              name="password"
              type="password"
              value={form.password}
              minLength={6}
              onChange={handleChange}
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Phone
            <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" name="phone" type="tel" value={form.phone} onChange={handleChange} />
          </label>
        </div>

        <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center rounded-lg border border-transparent bg-teal-700 px-4 font-extrabold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-65" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-slate-600">
        Already registered? <Link className="font-bold text-teal-700 no-underline hover:underline" to="/login">Log in</Link>
      </p>
    </section>
  )
}
