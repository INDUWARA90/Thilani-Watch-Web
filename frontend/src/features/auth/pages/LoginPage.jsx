import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'
import { ButtonSpinner } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePageTitle } from '@/shared/hooks/usePageTitle'

export const LoginPage = () => {
  usePageTitle('Login | Thilani Watch Web')

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
    <main className="min-h-screen bg-base flex items-center justify-center px-4 py-16 text-black sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-[540px] min-w-0 rounded-3xl border border-black/10 bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-12">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center rounded-full border border-black/10 bg-stone-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black shadow-2xs">
            Welcome back
          </span>
          <Link
            className="inline-flex min-h-11 w-fit max-w-full items-center justify-center rounded-full border border-black/15 bg-white px-5 text-sm font-bold text-black no-underline transition-all hover:bg-stone-50 hover:border-black/30 active:scale-95 shadow-2xs"
            to="/"
          >
            Visit store
          </Link>
        </div>

        <h1 className="mb-3 font-heading text-[38px] font-extrabold tracking-tight leading-[1.05] text-black sm:text-[44px]">
          Log in
        </h1>
        <p className="mb-8 text-base font-normal leading-relaxed text-stone-600">
          Access your account, saved addresses, wishlist, and orders.
        </p>

        <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-700 shadow-sm"
            >
              {error}
            </div>
          )}

          <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-black">
            Email
            <span className="flex items-center rounded-2xl border border-black/15 bg-stone-50/50 px-4 transition focus-within:border-black focus-within:bg-white focus-within:ring-2 focus-within:ring-black/10">
              <Mail className="h-4 w-4 shrink-0 text-stone-400" />
              <input
                className="min-h-[46px] min-w-0 flex-1 bg-transparent px-3 text-sm text-black outline-none placeholder:text-stone-400 font-normal normal-case"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </span>
          </label>

          <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-black">
            Password
            <span className="flex items-center rounded-2xl border border-black/15 bg-stone-50/50 px-4 transition focus-within:border-black focus-within:bg-white focus-within:ring-2 focus-within:ring-black/10">
              <LockKeyhole className="h-4 w-4 shrink-0 text-stone-400" />
              <input
                className="min-h-[46px] min-w-0 flex-1 bg-transparent px-3 text-sm text-black outline-none placeholder:text-stone-400 font-normal normal-case"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
              />
              <button
                className="cursor-pointer text-stone-500 transition hover:text-black p-1"
                type="button"
                aria-label="Toggle password visibility"
                aria-pressed={showPassword}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>

          <div className="-mt-1 flex justify-end">
            <Link className="text-sm font-semibold text-stone-600 no-underline transition hover:text-black hover:underline" to="/forgot-password">
              Forgot password?
            </Link>
          </div>

          <button
            className="mt-2 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-black px-8 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all duration-300 hover:bg-stone-800 hover:shadow-xl active:scale-98 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <ButtonSpinner />} {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-stone-600 border-t border-black/5 pt-6">
          New to Thilani Watch Web?{' '}
          <Link className="font-bold text-black no-underline transition hover:underline" to="/register">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  )
}
