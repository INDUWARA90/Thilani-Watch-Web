import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { ButtonSpinner } from '@/shared/ui/LoadingState'
import { authApi } from '@/features/auth/api/authApi'
import { getApiErrorMessage } from '@/shared/api/apiClient'

const steps = {
  email: 'email',
  otp: 'otp',
  password: 'password',
  complete: 'complete',
}

export const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(steps.email)
  const [email, setEmail] = useState('')
  const [resetSessionToken, setResetSessionToken] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleForgotPassword = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const submittedEmail = formData.get('email').trim()
      const apiMessage = await authApi.forgotPassword({ email: submittedEmail })

      setEmail(submittedEmail)
      setMessage(apiMessage)
      setStep(steps.otp)
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Could not send the OTP. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const otp = formData.get('otp').trim()
      const verifyRes = await authApi.verifyOtp({ email, otp })

      setResetSessionToken(verifyRes?.resetSessionToken ?? '')
      setMessage('OTP verified. Choose a new password.')
      setStep(steps.password)
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Invalid or expired OTP. Please check the code and try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const newPassword = formData.get('newPassword')
      const confirmPassword = formData.get('confirmPassword')

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }

      const apiMessage = await authApi.resetPassword({
        email,
        resetSessionToken,
        newPassword,
      })

      setMessage(apiMessage)
      setStep(steps.complete)
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Could not reset the password. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-[560px] min-w-0 rounded-[24px] border border-[#E5E7EB] bg-white p-5 text-[#121212] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] sm:p-9">
      <p className="mb-3 text-sm font-medium tracking-wide text-[#6C757D]">Password reset</p>
      <h1 className="mb-3 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#121212] sm:text-[44px]">
        Reset password
      </h1>
      <p className="mb-8 text-base leading-7 text-[#6C757D]">
        Request an OTP, verify it, then create a new password.
      </p>

      <div className="mb-6 grid grid-cols-3 gap-2 text-xs font-semibold text-[#6C757D]">
        <StepPill active={step === steps.email} complete={step !== steps.email} label="Email" />
        <StepPill active={step === steps.otp} complete={[steps.password, steps.complete].includes(step)} label="OTP" />
        <StepPill active={[steps.password, steps.complete].includes(step)} complete={step === steps.complete} label="Password" />
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-[12px] border border-[#DC3545]/40 bg-[#FDECEE] px-4 py-3 text-sm font-medium text-[#DC3545]"
        >
          {error}
        </div>
      )}

      {message && (
        <div className="mb-5 rounded-[12px] border border-[#198754]/30 bg-[#EAF7EF] px-4 py-3 text-sm font-medium text-[#146C43]">
          {message}
        </div>
      )}

      {step === steps.email && (
        <form className="grid gap-5" onSubmit={handleForgotPassword} noValidate>
          <label className="grid gap-2 text-sm font-medium text-[#121212]">
            Email
            <span className={authInputShellClass}>
              <Mail className="h-4 w-4 shrink-0 text-[#6C757D]" />
              <input
                className={authEmbeddedInputClass}
                name="email"
                type="email"
                placeholder="you@example.com"
                defaultValue={email}
                required
              />
            </span>
          </label>

          <SubmitButton isSubmitting={isSubmitting} loadingLabel="Sending OTP" label="Send OTP" />
        </form>
      )}

      {step === steps.otp && (
        <form className="grid gap-5" onSubmit={handleVerifyOtp} noValidate>
          <label className="grid gap-2 text-sm font-medium text-[#121212]">
            OTP
            <span className={authInputShellClass}>
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#6C757D]" />
              <input
                className={authEmbeddedInputClass}
                name="otp"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="6-digit code"
                required
              />
            </span>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SubmitButton isSubmitting={isSubmitting} loadingLabel="Verifying" label="Verify OTP" />
            <button
              className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-[14px] border border-[#121212]/15 bg-white px-8 text-sm font-semibold text-[#121212] transition-colors duration-200 hover:bg-[#121212] hover:text-white sm:w-fit"
              type="button"
              disabled={isSubmitting}
              onClick={() => setStep(steps.email)}
            >
              Change email
            </button>
          </div>
        </form>
      )}

      {step === steps.password && (
        <form className="grid gap-5" onSubmit={handleResetPassword} noValidate>
          <label className="grid gap-2 text-sm font-medium text-[#121212]">
            New password
            <span className={authInputShellClass}>
              <LockKeyhole className="h-4 w-4 shrink-0 text-[#6C757D]" />
              <input
                className={authEmbeddedInputClass}
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
                minLength={8}
                required
              />
              <PasswordToggle showPassword={showPassword} onToggle={() => setShowPassword((current) => !current)} />
            </span>
          </label>

          <label className="grid gap-2 text-sm font-medium text-[#121212]">
            Confirm password
            <input
              className="min-h-[46px] min-w-0 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] px-[15px] text-[15px] text-[#121212] outline-none placeholder:text-[#9CA3AF] transition-colors duration-200 focus:border-[#121212] focus:bg-white"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter new password"
              minLength={8}
              required
            />
          </label>

          <SubmitButton isSubmitting={isSubmitting} loadingLabel="Resetting" label="Reset password" />
        </form>
      )}

      {step === steps.complete && (
        <button
          className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-[14px] bg-[#121212] px-8 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#272222] sm:w-fit"
          type="button"
          onClick={() => navigate('/login')}
        >
          Back to login
        </button>
      )}

      <p className="mt-6 text-sm text-[#6C757D]">
        Remembered your password?{' '}
        <Link className="font-semibold text-[#121212] no-underline transition-colors duration-200 hover:text-[#6C757D]" to="/login">
          Log in
        </Link>
      </p>
    </section>
  )
}

const StepPill = ({ active, complete, label }) => (
  <span
    className={`inline-flex min-h-9 items-center justify-center rounded-[12px] border px-3 ${
      active || complete
        ? 'border-[#121212] bg-[#121212] text-white'
        : 'border-[#E5E7EB] bg-[#F9FAFB] text-[#6C757D]'
    }`}
  >
    {label}
  </span>
)

const SubmitButton = ({ isSubmitting, loadingLabel, label }) => (
  <button
    className="mt-1 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#121212] px-8 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#272222] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
    type="submit"
    disabled={isSubmitting}
  >
    {isSubmitting && <ButtonSpinner />} {isSubmitting ? loadingLabel : label}
  </button>
)

const PasswordToggle = ({ showPassword, onToggle }) => (
  <button
    className="cursor-pointer text-[#6C757D] transition-colors duration-200 hover:text-[#121212]"
    type="button"
    aria-label="Toggle password visibility"
    aria-pressed={showPassword}
    onClick={onToggle}
  >
    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
  </button>
)

const authInputShellClass =
  'flex items-center rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] px-[15px] transition-colors duration-200 focus-within:border-[#121212] focus-within:bg-white'

const authEmbeddedInputClass =
  'min-h-[46px] min-w-0 flex-1 bg-transparent px-3 text-[15px] text-[#121212] outline-none placeholder:text-[#9CA3AF]'
