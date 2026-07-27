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
    <section className="mx-auto w-full max-w-[560px] min-w-0 rounded-lg border border-white/12 bg-surface p-5 text-white shadow-glowSm sm:p-9">
      <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase text-white/70">Password reset</p>
      <h1 className="mb-3 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-[44px]">
        Reset password
      </h1>
      <p className="mb-8 text-base leading-7 text-white/70">
        Request an OTP, verify it, then create a new password.
      </p>

      <div className="mb-6 grid grid-cols-3 gap-2 text-xs font-semibold text-white/65">
        <StepPill active={step === steps.email} complete={step !== steps.email} label="Email" />
        <StepPill active={step === steps.otp} complete={[steps.password, steps.complete].includes(step)} label="OTP" />
        <StepPill active={[steps.password, steps.complete].includes(step)} complete={step === steps.complete} label="Password" />
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200"
        >
          {error}
        </div>
      )}

      {message && (
        <div className="mb-5 rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200">
          {message}
        </div>
      )}

      {step === steps.email && (
        <form className="grid gap-5" onSubmit={handleForgotPassword} noValidate>
          <label className="grid gap-2 text-sm font-medium text-white/65">
            Email
            <span className={authInputShellClass}>
              <Mail className="h-4 w-4 shrink-0 text-white/70" />
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
          <label className="grid gap-2 text-sm font-medium text-white/65">
            OTP
            <span className={authInputShellClass}>
              <ShieldCheck className="h-4 w-4 shrink-0 text-white/70" />
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
              className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 text-sm font-bold text-white transition hover:border-white/45 hover:shadow-glowSm sm:w-fit"
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
          <label className="grid gap-2 text-sm font-medium text-white/65">
            New password
            <span className={authInputShellClass}>
              <LockKeyhole className="h-4 w-4 shrink-0 text-white/70" />
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

          <label className="grid gap-2 text-sm font-medium text-white/65">
            Confirm password
            <input
              className="min-h-[46px] min-w-0 rounded-lg border border-white/12 bg-black/35 px-[15px] text-[15px] text-white outline-none placeholder:text-white/65 transition focus:border-white/45 focus:ring-2 focus:ring-white/10"
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
          className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full bg-white px-8 text-sm font-bold text-black transition hover:shadow-glow sm:w-fit"
          type="button"
          onClick={() => navigate('/login')}
        >
          Back to login
        </button>
      )}

      <p className="mt-6 text-sm text-white/70">
        Remembered your password?{' '}
        <Link className="font-semibold text-white no-underline transition hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" to="/login">
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
        ? 'border-white bg-white text-black'
        : 'border-white/12 bg-white/5 text-white/65'
    }`}
  >
    {label}
  </span>
)

const SubmitButton = ({ isSubmitting, loadingLabel, label }) => (
  <button
    className="mt-1 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-black transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
    type="submit"
    disabled={isSubmitting}
  >
    {isSubmitting && <ButtonSpinner />} {isSubmitting ? loadingLabel : label}
  </button>
)

const PasswordToggle = ({ showPassword, onToggle }) => (
  <button
    className="cursor-pointer text-white/65 transition hover:text-white"
    type="button"
    aria-label="Toggle password visibility"
    aria-pressed={showPassword}
    onClick={onToggle}
  >
    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
  </button>
)

const authInputShellClass =
  'flex items-center rounded-lg border border-white/12 bg-black/35 px-[15px] transition focus-within:border-white/45 focus-within:ring-2 focus-within:ring-white/10'

const authEmbeddedInputClass =
  'min-h-[46px] min-w-0 flex-1 bg-transparent px-3 text-[15px] text-white outline-none placeholder:text-white/65'
