import { useState } from 'react'
import { Eye } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { ButtonSpinner } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { useAuth } from '@/features/auth/hooks/useAuth'

export const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    <section className="mx-auto w-full max-w-[760px] rounded-[20px] border border-white bg-white/20 p-6 text-white shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)] backdrop-blur sm:p-8">
      <p className="mb-3 text-sm font-normal text-white">Create account</p>
      <h1 className="mb-4 text-[44px] font-extrabold leading-tight text-white">Register</h1>
      <p className="mb-7 text-base leading-7 text-white">Create a customer account with your contact details.</p>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        {error && <div className="border border-[#DC3545] bg-red-50 px-4 py-3 font-normal text-[#DC3545]">{error}</div>}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-base font-normal text-white">
            Name
            <input className={authInputClass} name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label className="grid gap-2 text-base font-normal text-white">
            Email
            <input className={authInputClass} name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label className="grid gap-2 text-base font-normal text-white">
            Password
            <span className="flex items-center border border-white bg-white px-[15px] focus-within:border-[#0D6EFD] focus-within:ring-2 focus-within:ring-[#0D6EFD]/25">
              <input className="min-h-[45px] min-w-0 flex-1 text-[#121212] outline-none" name="password" type={showPassword ? 'text' : 'password'} value={form.password} minLength={6} onChange={handleChange} required />
              <button className="cursor-pointer text-[#6C757D] hover:text-[#F49006]" type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword((current) => !current)}>
                <Eye className="h-4 w-4" />
              </button>
            </span>
          </label>

          <label className="grid gap-2 text-base font-normal text-white">
            Phone
            <input className={authInputClass} name="phone" type="tel" value={form.phone} onChange={handleChange} />
          </label>
        </div>

        <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#121212] px-8 text-sm font-normal text-white transition hover:bg-[#272222] disabled:cursor-not-allowed disabled:opacity-65" type="submit" disabled={isSubmitting}>
          {isSubmitting && <ButtonSpinner />} {isSubmitting ? 'Creating account' : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-white">
        Already registered? <Link className="font-bold text-white no-underline hover:text-[#121212]" to="/login">Log in</Link>
      </p>
    </section>
  )
}

const authInputClass = 'min-h-[45px] min-w-0 border border-white bg-white px-[15px] text-[#121212] outline-none focus:border-[#0D6EFD] focus:ring-2 focus:ring-[#0D6EFD]/25'
