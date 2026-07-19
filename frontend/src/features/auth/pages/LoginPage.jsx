import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'
import { ButtonSpinner } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { useAuth } from '@/features/auth/hooks/useAuth'

export const LoginPage = () => {
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)

      await login({
        email: formData.get('email').trim(),
        password: formData.get('password'),
      })

      navigate(redirectTo, { replace: true })
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Login failed. Check your email and password.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-[520px] min-w-0 rounded-[24px] border border-[#E5E7EB] bg-white p-5 text-[#121212] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] sm:p-9">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium tracking-wide text-[#6C757D]">Welcome back</p>
        <Link
          className="inline-flex min-h-11 w-fit max-w-full items-center justify-center rounded-[14px] border border-[#121212]/15 bg-white px-5 text-sm font-medium text-[#121212] no-underline transition-colors duration-200 hover:bg-[#121212] hover:text-white sm:px-8"
          to="/"
        >
          Visit Store
        </Link>
      </div>

      <h1 className="mb-3 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#121212] sm:text-[44px]">
        Log in
      </h1>
      <p className="mb-8 text-base leading-7 text-[#6C757D]">
        Access your account, saved addresses, wishlist, and orders.
      </p>

      <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
        {error && (
          <div
            role="alert"
            className="rounded-[12px] border border-[#DC3545]/40 bg-[#FDECEE] px-4 py-3 text-sm font-medium text-[#DC3545]"
          >
            {error}
          </div>
        )}

        <label className="grid gap-2 text-sm font-medium text-[#121212]">
          Email
          <span className="flex items-center rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] px-[15px] transition-colors duration-200 focus-within:border-[#121212] focus-within:bg-white">
            <Mail className="h-4 w-4 shrink-0 text-[#6C757D]" />
            <input
              className="min-h-[46px] min-w-0 flex-1 bg-transparent px-3 text-[15px] text-[#121212] outline-none placeholder:text-[#9CA3AF]"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium text-[#121212]">
          Password
          <span className="flex items-center rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] px-[15px] transition-colors duration-200 focus-within:border-[#121212] focus-within:bg-white">
            <LockKeyhole className="h-4 w-4 shrink-0 text-[#6C757D]" />
            <input
              className="min-h-[46px] min-w-0 flex-1 bg-transparent px-3 text-[15px] text-[#121212] outline-none placeholder:text-[#9CA3AF]"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
            />
            <button
              className="cursor-pointer text-[#6C757D] transition-colors duration-200 hover:text-[#121212]"
              type="button"
              aria-label="Toggle password visibility"
              aria-pressed={showPassword}
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </span>
        </label>

        <div className="-mt-2 flex justify-end">
          <Link className="text-sm font-semibold text-[#121212] no-underline transition-colors duration-200 hover:text-[#6C757D]" to="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <button
          className="mt-1 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#121212] px-8 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#272222] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting && <ButtonSpinner />} {isSubmitting ? 'Logging in' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-[#6C757D]">
        New to Thilani Watch Web?{' '}
        <Link className="font-semibold text-[#121212] no-underline transition-colors duration-200 hover:text-[#6C757D]" to="/register">
          Create an account
        </Link>
      </p>
    </section>
  )
}
