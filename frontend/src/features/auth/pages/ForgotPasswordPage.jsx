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
    <main className="min-h-screen bg-base flex items-center justify-center px-4 py-16 text-black sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-[540px] min-w-0 rounded-3xl border border-black/10 bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-12">
        <span className="mb-4 inline-flex items-center rounded-full border border-black/10 bg-stone-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black shadow-2xs">
          Password reset
        </span>
        <h1 className="mb-3 font-heading text-[38px] font-extrabold tracking-tight leading-[1.05] text-black sm:text-[44px]">
          Reset password
        </h1>
        <p className="mb-8 text-base font-normal leading-relaxed text-stone-600">
          Request an OTP, verify it, then create a new password.
        </p>

        <div className="mb-6 grid grid-cols-3 gap-2 text-xs font-bold uppercase tracking-wider">
          <StepPill active={step === steps.email} complete={step !== steps.email} label="Email" />
          <StepPill active={step === steps.otp} complete={[steps.password, steps.complete].includes(step)} label="OTP" />
          <StepPill active={[steps.password, steps.complete].includes(step)} complete={step === steps.complete} label="Password" />
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-700 shadow-sm"
          >
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-800 shadow-sm">
            {message}
          </div>
        )}

        {step === steps.email && (
          <form className="grid gap-5" onSubmit={handleForgotPassword} noValidate>
            <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-black">
              Email
              <span className={authInputShellClass}>
                <Mail className="h-4 w-4 shrink-0 text-stone-400" />
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

            <SubmitButton isSubmitting={isSubmitting} loadingLabel="Sending OTP..." label="Send OTP" />
          </form>
        )}

        {step === steps.otp && (
          <form className="grid gap-5" onSubmit={handleVerifyOtp} noValidate>
            <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-black">
              OTP
              <span className={authInputShellClass}>
                <ShieldCheck className="h-4 w-4 shrink-0 text-stone-400" />
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
              <SubmitButton isSubmitting={isSubmitting} loadingLabel="Verifying..." label="Verify OTP" />
              <button
                className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full border border-black/15 bg-white px-8 text-sm font-bold text-black transition-all hover:bg-stone-50 hover:border-black/30 active:scale-95 shadow-2xs sm:w-fit"
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
            <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-black">
              New password
              <span className={authInputShellClass}>
                <LockKeyhole className="h-4 w-4 shrink-0 text-stone-400" />
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

            <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-black">
              Confirm password
              <input
                className={authInputClass}
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter new password"
                minLength={8}
                required
              />
            </label>

            <SubmitButton isSubmitting={isSubmitting} loadingLabel="Resetting..." label="Reset password" />
          </form>
        )}

        {step === steps.complete && (
          <button
            className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-black px-8 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all duration-300 hover:bg-stone-800 hover:shadow-xl active:scale-98 sm:w-fit"
            type="button"
            onClick={() => navigate('/login')}
          >
            Back to login
          </button>
        )}

        <p className="mt-8 text-center text-sm font-medium text-stone-600 border-t border-black/5 pt-6">
          Remembered your password?{' '}
          <Link className="font-bold text-black no-underline transition hover:underline" to="/login">
            Log in
          </Link>
        </p>
      </section>
    </main>
  )
}

const StepPill = ({ active, complete, label }) => (
  <span
    className={`inline-flex min-h-9 items-center justify-center rounded-full border px-4 transition-all ${
      active || complete
        ? 'border-black bg-black text-white font-bold shadow-xs'
        : 'border-black/15 bg-stone-50 text-stone-400 font-medium'
    }`}
  >
    {label}
  </span>
)

const SubmitButton = ({ isSubmitting, loadingLabel, label }) => (
  <button
    className="mt-2 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-black px-8 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all duration-300 hover:bg-stone-800 hover:shadow-xl active:scale-98 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
    type="submit"
    disabled={isSubmitting}
  >
    {isSubmitting && <ButtonSpinner />} {isSubmitting ? loadingLabel : label}
  </button>
)

const PasswordToggle = ({ showPassword, onToggle }) => (
  <button
    className="cursor-pointer text-stone-500 transition hover:text-black p-1"
    type="button"
    aria-label="Toggle password visibility"
    aria-pressed={showPassword}
    onClick={onToggle}
  >
    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
  </button>
)

const authInputShellClass =
  'flex items-center rounded-2xl border border-black/15 bg-stone-50/50 px-4 transition focus-within:border-black focus-within:bg-white focus-within:ring-2 focus-within:ring-black/10'

const authEmbeddedInputClass =
  'min-h-[46px] min-w-0 flex-1 bg-transparent px-3 text-sm text-black outline-none placeholder:text-stone-400 font-normal normal-case'

const authInputClass =
  'min-h-[46px] min-w-0 rounded-2xl border border-black/15 bg-stone-50/50 px-4 py-2.5 text-sm font-medium text-black outline-none placeholder:text-stone-400 transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10 normal-case'