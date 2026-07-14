import { useState } from 'react'
import { Eye, LockKeyhole, Mail } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'
import { ButtonSpinner } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { useAuth } from '@/features/auth/hooks/useAuth'

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
    <section className="mx-auto w-full max-w-[520px] rounded-[20px] border border-white bg-white/20 p-6 text-white shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)] backdrop-blur sm:p-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-normal text-white">Welcome back</p>
        <Link
          className="inline-flex min-h-11 w-fit items-center justify-center rounded-[14px] border border-white bg-white/20 px-8 text-sm font-normal text-white no-underline transition hover:bg-white hover:text-[#121212]"
          to="/"
        >
          Visit Store
        </Link>
      </div>
      <h1 className="mb-4 text-[44px] font-extrabold leading-tight text-white">Log in</h1>
      <p className="mb-7 text-base leading-7 text-white">Access your account, saved addresses, wishlist, and orders.</p>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        {error && <div className="border border-[#DC3545] bg-red-50 px-4 py-3 font-normal text-[#DC3545]">{error}</div>}

        <label className="grid gap-2 text-base font-normal text-white">
          Email
          <span className="flex items-center border border-white bg-white px-[15px] focus-within:border-[#0D6EFD] focus-within:ring-2 focus-within:ring-[#0D6EFD]/25">
            <Mail className="h-4 w-4 text-[#6C757D]" />
            <input className="min-h-[45px] min-w-0 flex-1 px-3 text-[#121212] outline-none" name="email" type="email" value={form.email} onChange={handleChange} required />
          </span>
        </label>

        <label className="grid gap-2 text-base font-normal text-white">
          Password
          <span className="flex items-center border border-white bg-white px-[15px] focus-within:border-[#0D6EFD] focus-within:ring-2 focus-within:ring-[#0D6EFD]/25">
            <LockKeyhole className="h-4 w-4 text-[#6C757D]" />
            <input className="min-h-[45px] min-w-0 flex-1 px-3 text-[#121212] outline-none" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} required />
            <button className="cursor-pointer text-[#6C757D] hover:text-[#F49006]" type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword((current) => !current)}>
              <Eye className="h-4 w-4" />
            </button>
          </span>
        </label>

        <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#121212] px-8 text-sm font-normal text-white transition hover:bg-[#272222] disabled:cursor-not-allowed disabled:opacity-65" type="submit" disabled={isSubmitting}>
          {isSubmitting && <ButtonSpinner />} {isSubmitting ? 'Logging in' : 'Log in'}
        </button>
      </form>

      <p className="mt-5 text-white">
        New to Thilani Watch Web? <Link className="font-bold text-white no-underline hover:text-[#121212]" to="/register">Create an account</Link>
      </p>
    </section>
  )
}
