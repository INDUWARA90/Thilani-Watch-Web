import { useState } from 'react'
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
    <section className="mx-auto w-full max-w-[520px] rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(28,41,56,0.08)] sm:p-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-extrabold uppercase tracking-normal text-teal-700">Welcome back</p>
        <Link
          className="inline-flex min-h-10 w-fit items-center justify-center rounded-lg border border-teal-200 bg-teal-50 px-3.5 text-sm font-extrabold text-teal-800 no-underline hover:bg-teal-100"
          to="/"
        >
          Visit Store
        </Link>
      </div>
      <h1 className="mb-4 text-4xl font-bold leading-tight text-slate-950">Log in</h1>
      <p className="mb-7 text-lg text-slate-600">Access your account, saved addresses, wishlist, and orders.</p>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}

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
            onChange={handleChange}
            required
          />
        </label>

        <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center rounded-lg border border-transparent bg-teal-700 px-4 font-extrabold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-65" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-5 text-slate-600">
        New to Thilani Watch Web? <Link className="font-bold text-teal-700 no-underline hover:underline" to="/register">Create an account</Link>
      </p>
    </section>
  )
}
