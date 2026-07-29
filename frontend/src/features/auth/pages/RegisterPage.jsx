import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { ButtonSpinner } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePageTitle } from '@/shared/hooks/usePageTitle'

export const RegisterPage = () => {
  usePageTitle('Register | Thilani Watch Web')

  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const {
    formState: { errors },
    handleSubmit,
    register: registerField,
  } = useForm({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      phone: '',
    },
  })

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => navigate('/dashboard', { replace: true }),
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, 'Registration failed. Please check your details.'))
    },
  })
  const isSubmitting = registerMutation.isPending

  const submitRegister = async (values) => {
    setError('')
    const payload = {
      email: values.email.trim(),
      name: values.name.trim(),
      password: values.password,
    }
    const phone = values.phone.trim()
    await registerMutation.mutateAsync(phone ? { ...payload, phone } : payload)
  }

  return (
    <main className="min-h-screen bg-base flex items-center justify-center px-4 py-16 text-black sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-[540px] min-w-0 rounded-3xl border border-black/10 bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-12">
        <span className="mb-4 inline-flex items-center rounded-full border border-black/10 bg-stone-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black shadow-2xs">
          Create account
        </span>
        <h1 className="mb-3 font-heading text-[38px] font-extrabold tracking-tight leading-[1.05] text-black sm:text-[44px]">
          Register
        </h1>
        <p className="mb-8 text-base font-normal leading-relaxed text-stone-600">
          Create a customer account with your contact details to begin shopping.
        </p>

        <form className="grid gap-5" onSubmit={handleSubmit(submitRegister)} noValidate>
          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-700 shadow-sm"
            >
              {error}
            </div>
          )}

          <div className="grid gap-4">
            <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-black">
              Name 
              <input
                className={authInputClass}
                placeholder="Full name"
                aria-invalid={Boolean(errors.name)}
                {...registerField('name', {
                  required: 'Name is required.',
                  setValueAs: (value) => value.trim(),
                })}
              />
              {errors.name && <span className="text-xs font-semibold normal-case tracking-normal text-red-700">{errors.name.message}</span>}
            </label>

            <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-black">
              Email 
              <input
                className={authInputClass}
                type="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                {...registerField('email', {
                  required: 'Email is required.',
                  setValueAs: (value) => value.trim(),
                })}
              />
              {errors.email && <span className="text-xs font-semibold normal-case tracking-normal text-red-700">{errors.email.message}</span>}
            </label>

            <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-black">
              Password
              <span className="flex items-center rounded-2xl border border-black/15 bg-stone-50/50 px-4 transition focus-within:border-black focus-within:bg-white focus-within:ring-2 focus-within:ring-black/10">
                <input
                  className="min-h-[46px] min-w-0 flex-1 bg-transparent py-2.5 text-sm text-black outline-none placeholder:text-stone-400 font-normal normal-case"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  aria-invalid={Boolean(errors.password)}
                  {...registerField('password', {
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters.',
                    },
                    required: 'Password is required.',
                  })}
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
              {errors.password && <span className="text-xs font-semibold normal-case tracking-normal text-red-700">{errors.password.message}</span>}
            </label>

            <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-black">
              Phone (Optional)
              <input
                className={authInputClass}
                type="tel"
                placeholder="+94 77 123 4567"
                {...registerField('phone', {
                  setValueAs: (value) => value.trim(),
                })}
              />
            </label>
          </div>

          <button
            className="mt-3 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-black px-8 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all duration-300 hover:bg-stone-800 hover:shadow-xl active:scale-98 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <ButtonSpinner />} {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-stone-600 border-t border-black/5 pt-6">
          Already registered?{' '}
          <Link className="font-bold text-black no-underline transition hover:underline" to="/login">
            Log in
          </Link>
        </p>
      </section>
    </main>
  )
}

const authInputClass =
  'min-h-[46px] min-w-0 rounded-2xl border border-black/15 bg-stone-50/50 px-4 py-2.5 text-sm font-medium text-black outline-none placeholder:text-stone-400 transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10 normal-case'
