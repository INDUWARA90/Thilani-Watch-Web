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
    <section className="mx-auto w-full max-w-[560px]  border border-[#E5E7EB] bg-white p-6 text-[#121212] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] sm:p-9 rounded-[24px]">
      <p className="mb-3 text-sm font-medium tracking-wide text-[#6C757D]">Create account</p>
      <h1 className="mb-3 text-[40px] font-extrabold leading-[1.1] tracking-tight text-[#121212] sm:text-[44px]">
        Register
      </h1>
      <p className="mb-8 text-base leading-7 text-[#6C757D]">
        Create a customer account with your contact details.
      </p>

      <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
        {error && (
          <div
            role="alert"
            className="rounded-sm border border-[#DC3545]/40 bg-[#FDECEE] px-4 py-3 text-sm font-medium text-[#DC3545]"
          >
            {error}
          </div>
        )}

        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-[#121212]">
            Name
            <input className={authInputClass} name="name" placeholder="Full name" required />
          </label>

          <label className="grid gap-2 text-sm font-medium text-[#121212]">
            Email
            <input className={authInputClass} name="email" type="email" placeholder="you@example.com" required />
          </label>

          <label className="grid gap-2 text-sm font-medium text-[#121212]">
            Password
            <span className="flex items-center rounded-sm border border-[#E5E7EB] bg-[#F9FAFB] px-[15px] transition-colors duration-200 focus-within:border-[#121212] focus-within:bg-white">
              <input
                className="min-h-[46px] min-w-0 flex-1 bg-transparent px-1 text-[15px] text-[#121212] outline-none placeholder:text-[#9CA3AF]"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                minLength={6}
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

          <label className="grid gap-2 text-sm font-medium text-[#121212]">
            Phone
            <input className={authInputClass} name="phone" type="tel" placeholder="Optional" />
          </label>
        </div>

        <button
          className="mt-1 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-[#121212] px-8 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#272222] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting && <ButtonSpinner />} {isSubmitting ? 'Creating account' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-[#6C757D]">
        Already registered?{' '}
        <Link className="font-semibold text-[#121212] no-underline transition-colors duration-200 hover:text-[#6C757D]" to="/login">
          Log in
        </Link>
      </p>
    </section>
  )
}

const authInputClass =
  'min-h-[46px] min-w-0 rounded-sm border border-[#E5E7EB] bg-[#F9FAFB] px-[15px] text-[15px] text-[#121212] outline-none placeholder:text-[#9CA3AF] transition-colors duration-200 focus:border-[#121212] focus:bg-white'