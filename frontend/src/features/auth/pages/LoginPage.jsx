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
    <section className="mx-auto w-full max-w-[520px] min-w-0 rounded-lg border border-white/12 bg-surface p-5 text-white shadow-glowSm sm:p-9">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex w-fit rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase text-white/70">Welcome back</p>
        <Link
          className="inline-flex min-h-11 w-fit max-w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 text-sm font-bold text-white no-underline transition hover:border-white/45 hover:shadow-glowSm sm:px-8"
          to="/"
        >
          Visit Store
        </Link>
      </div>

      <h1 className="mb-3 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-[44px]">
        Log in
      </h1>
      <p className="mb-8 text-base leading-7 text-white/70">
        Access your account, saved addresses, wishlist, and orders.
      </p>

      <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200"
          >
            {error}
          </div>
        )}

        <label className="grid gap-2 text-sm font-medium text-white/65">
          Email
          <span className="flex items-center rounded-lg border border-white/12 bg-black/35 px-[15px] transition focus-within:border-white/45 focus-within:ring-2 focus-within:ring-white/10">
            <Mail className="h-4 w-4 shrink-0 text-white/70" />
            <input
              className="min-h-[46px] min-w-0 flex-1 bg-transparent px-3 text-[15px] text-white outline-none placeholder:text-white/65"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium text-white/65">
          Password
          <span className="flex items-center rounded-lg border border-white/12 bg-black/35 px-[15px] transition focus-within:border-white/45 focus-within:ring-2 focus-within:ring-white/10">
            <LockKeyhole className="h-4 w-4 shrink-0 text-white/70" />
            <input
              className="min-h-[46px] min-w-0 flex-1 bg-transparent px-3 text-[15px] text-white outline-none placeholder:text-white/65"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
            />
            <button
              className="cursor-pointer text-white/65 transition hover:text-white"
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
          <Link className="text-sm font-semibold text-white/70 no-underline transition hover:text-white" to="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <button
          className="mt-1 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-black transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting && <ButtonSpinner />} {isSubmitting ? 'Logging in' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-white/70">
        New to Thilani Watch Web?{' '}
        <Link className="font-semibold text-white no-underline transition hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" to="/register">
          Create an account
        </Link>
      </p>
    </section>
  )
}
