import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { ButtonSpinner } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { useAuth } from '@/features/auth/hooks/useAuth'

export const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const phone = formData.get('phone').trim()
      const payload = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        password: formData.get('password'),
        ...(phone && { phone }),
      }

      await register(payload)
      navigate('/dashboard', { replace: true })
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Registration failed. Please check your details.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-[560px] min-w-0 rounded-lg border border-primary/10 bg-card p-5 text-primary shadow-premiumSm sm:p-9">
      <p className="mb-3 inline-flex rounded-full border border-primary/10 bg-card px-3 py-1 text-xs font-semibold uppercase text-primary">Create account</p>
      <h1 className="mb-3 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-primary sm:text-[44px]">
        Register
      </h1>
      <p className="mb-8 text-base leading-7 text-primary">
        Create a customer account with your contact details.
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

        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-primary">
            Name
            <input className={authInputClass} name="name" placeholder="Full name" required />
          </label>

          <label className="grid gap-2 text-sm font-medium text-primary">
            Email
            <input className={authInputClass} name="email" type="email" placeholder="you@example.com" required />
          </label>

          <label className="grid gap-2 text-sm font-medium text-primary">
            Password
            <span className="flex items-center rounded-lg border border-primary/10 bg-black/35 px-[15px] transition focus-within:border-primary/10 focus-within:ring-2 focus-within:ring-accent/30">
              <input
                className="min-h-[46px] min-w-0 flex-1 bg-transparent px-1 text-[15px] text-primary outline-none placeholder:text-primary"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                minLength={6}
                required
              />
              <button
                className="cursor-pointer text-primary transition hover:text-accent"
                type="button"
                aria-label="Toggle password visibility"
                aria-pressed={showPassword}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>

          <label className="grid gap-2 text-sm font-medium text-primary">
            Phone
            <input className={authInputClass} name="phone" type="tel" placeholder="Optional" />
          </label>
        </div>

        <button
          className="mt-1 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-black transition hover:shadow-premium disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting && <ButtonSpinner />} {isSubmitting ? 'Creating account' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-primary">
        Already registered?{' '}
        <Link className="font-semibold text-primary no-underline transition " to="/login">
          Log in
        </Link>
      </p>
    </section>
  )
}

const authInputClass =
  'min-h-[46px] min-w-0 rounded-lg border border-primary/10 bg-black/35 px-[15px] text-[15px] text-primary outline-none placeholder:text-primary transition focus:border-primary/10 focus:ring-2 focus:ring-accent/30'
