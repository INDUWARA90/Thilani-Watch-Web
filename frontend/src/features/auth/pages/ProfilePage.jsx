import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, MapPin, User, Plus, X } from 'lucide-react'
import { ButtonSpinner, LoadingState } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { authApi } from '@/features/auth/api/authApi'

const emptyAddress = {
  addressLine1: '',
  addressLine2: '',
  city: '',
  country: 'Sri Lanka',
  district: '',
  fullName: '',
  isDefault: false,
  label: 'Home',
  phone: '',
  postalCode: '',
}

export const ProfilePage = () => {
  const { updateProfile, user } = useAuth()
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [addresses, setAddresses] = useState([])
  const [addressForm, setAddressForm] = useState(emptyAddress)
  const [editingAddressId, setEditingAddressId] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const loadAddresses = async () => {
    const payload = await authApi.getAddresses()
    setAddresses(normalizeAddresses(payload))
  }

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        const payload = await authApi.getAddresses()
        if (isMounted) {
          setAddresses(normalizeAddresses(payload))
          setError('')
        }
      } catch (apiError) {
        if (isMounted) {
          setError(getApiErrorMessage(apiError, 'Unable to load addresses.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [])

  const saveProfile = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSaving(true)
    try {
      await updateProfile({
        name: profile.name.trim(),
        phone: profile.phone.trim(),
      })
      setMessage('Profile updated successfully.')
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to update profile.'))
    } finally {
      setIsSaving(false)
    }
  }

  const saveAddress = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSaving(true)
    try {
      const payload = trimAddress(addressForm)
      if (editingAddressId) {
        await authApi.updateAddress(editingAddressId, payload)
      } else {
        await authApi.createAddress(payload)
      }
      setAddressForm(emptyAddress)
      setEditingAddressId('')
      await loadAddresses()
      setMessage(editingAddressId ? 'Address updated successfully.' : 'Address added successfully.')
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to save address.'))
    } finally {
      setIsSaving(false)
    }
  }

  const editAddress = (address) => {
    setEditingAddressId(getAddressId(address))
    setAddressForm({ ...emptyAddress, ...address })
  }

  const deleteAddress = async (address) => {
    setError('')
    setMessage('')
    try {
      await authApi.deleteAddress(getAddressId(address))
      await loadAddresses()
      setMessage('Address removed successfully.')
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to remove address.'))
    }
  }

  const setDefaultAddress = async (address) => {
    setError('')
    setMessage('')
    try {
      await authApi.setDefaultAddress(getAddressId(address))
      await loadAddresses()
      setMessage('Default address updated.')
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to set default address.'))
    }
  }

  return (
    <main className="mx-auto grid w-full min-w-0 max-w-[1200px] animate-fade-in gap-8 bg-base pb-12 text-white">
      <section className="relative min-w-0 overflow-hidden rounded-lg border border-white/12 bg-surface p-5 shadow-glowSm sm:p-10">
        <div className="glow-beam absolute left-0 top-0 h-px w-full bg-white/70 shadow-glow" />
        <p className="mb-2 text-xs font-bold uppercase text-white/65">Account settings</p>
        <h1 className="break-words font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">Profile & Addresses</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
          Manage your account contact details, security credentials, and shipping addresses.
        </p>
      </section>

      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3.5 text-sm font-medium text-red-200 shadow-sm backdrop-blur-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
      {message && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-4 py-3.5 text-sm font-medium text-emerald-200 shadow-sm backdrop-blur-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          <span>{message}</span>
        </div>
      )}

      {/* Profile Card */}
      <form className="flex min-w-0 flex-col justify-between rounded-lg border border-white/12 bg-surface p-5 shadow-glowSm sm:p-6" onSubmit={saveProfile}>
        <div className="grid gap-5">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-2">
            <div className="rounded-lg bg-white/10 p-2 text-white">
              <User className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-lg font-bold text-white">Personal Details</h2>
          </div>
          <Field label="Full Name" required value={profile.name} onChange={(value) => setProfile((current) => ({ ...current, name: value }))} />
          <Field label="Phone Number" type="tel" value={profile.phone} onChange={(value) => setProfile((current) => ({ ...current, phone: value }))} />
        </div>
        <button className={primaryButtonClass} disabled={isSaving} type="submit">
          {isSaving && <ButtonSpinner />} Save Profile Changes
        </button>
      </form>

      {/* Address Book Section */}
      <section className="grid min-w-0 gap-6 rounded-lg border border-white/12 bg-surface p-5 shadow-glowSm sm:p-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
          <div className="rounded-lg bg-white/10 p-2 text-white">
            <MapPin className="h-5 w-5" />
          </div>
          <h2 className="font-heading text-lg font-bold text-white">Saved Addresses</h2>
        </div>

        {isLoading ? (
          <LoadingState label="Loading address records" variant="table" rows={2} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((address) => (
              <article className="group relative flex min-w-0 flex-col justify-between rounded-lg border border-white/12 bg-black/25 p-5 transition duration-200 hover:border-white/30 hover:shadow-glowSm" key={getAddressId(address)}>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center rounded-md border border-white/12 bg-white/5 px-2.5 py-1 text-xs font-bold text-white shadow-2xs">
                      {address.label || 'Address'}
                    </span>
                    {address.isDefault && (
                      <span className="inline-flex items-center rounded-full border border-emerald-300/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-200">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 space-y-0.5 text-sm leading-relaxed text-white/65">
                    <p className="font-semibold text-white">{address.fullName}</p>
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{[address.city, address.district, address.postalCode].filter(Boolean).join(', ')}</p>
                    <p className="mt-1 text-xs font-medium uppercase text-white/70">{address.country}</p>
                    <p className="pt-1 font-mono text-xs text-white/65">{address.phone}</p>
                  </div>
                </div>
                
                <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                  <button className={secondaryButtonClass} type="button" onClick={() => editAddress(address)}>Edit</button>
                  {!address.isDefault && (
                    <button className={secondaryButtonClass} type="button" onClick={() => setDefaultAddress(address)}>Set Default</button>
                  )}
                  <button className={`${secondaryButtonClass} hover:text-red-600 hover:border-red-200 hover:bg-red-50/40`} type="button" onClick={() => deleteAddress(address)}>Delete</button>
                </div>
              </article>
            ))}
            {addresses.length === 0 && (
              <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] py-8 text-center md:col-span-2">
                <p className="text-sm font-medium text-white/65">No saved dispatch addresses found.</p>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Address Management Form */}
        <form className="mt-6 space-y-6 border-t border-white/10 pt-6" onSubmit={saveAddress}>
          <div className="flex items-center justify-between gap-4">
            <h3 className="inline-flex items-center gap-2 font-heading text-base font-bold text-white">
              {editingAddressId ? (
                <>Modify Address Entry</>
              ) : (
                <><Plus className="h-4 w-4 text-white" /> Register New Address</>
              )}
            </h3>
            {editingAddressId && (
              <button 
                type="button" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white/65 transition hover:text-white"
                onClick={() => {
                  setEditingAddressId('')
                  setAddressForm(emptyAddress)
                }}
              >
                <X className="h-3.5 w-3.5" /> Cancel Edit
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {addressFields.map(([name, label, type]) => (
              <Field 
                key={name} 
                label={label} 
                required={!['addressLine2', 'district'].includes(name)} 
                type={type} 
                value={addressForm[name]} 
                onChange={(value) => setAddressForm((current) => ({ ...current, [name]: value }))} 
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <label className="inline-flex items-center gap-3 cursor-pointer select-none group">
              <input 
                checked={addressForm.isDefault} 
                type="checkbox" 
                className="h-4 w-4 rounded border-slate-300 text-[#F49006] focus:ring-[#F49006]/20 transition-all cursor-pointer"
                onChange={(event) => setAddressForm((current) => ({ ...current, isDefault: event.target.checked }))} 
              />
              <span className="text-sm font-medium text-white/75 transition group-hover:text-white">Set as preferred destination</span>
            </label>

            <button className={`${primaryButtonClass} mt-0`} disabled={isSaving} type="submit">
              {isSaving && <ButtonSpinner />} {editingAddressId ? 'Update Address' : 'Add Address Record'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

const addressFields = [
  ['label', 'Address Label (e.g., Home, Work)'],
  ['fullName', 'Recipient Full Name'],
  ['phone', 'Contact Number'],
  ['addressLine1', 'Street Address Line 1'],
  ['addressLine2', 'Suite, Building, Unit (Optional)'],
  ['city', 'City / Suburb'],
  ['district', 'State / Province / District'],
  ['postalCode', 'Postal / ZIP Code'],
  ['country', 'Country'],
]

const Field = ({ label, onChange, required = false, type = 'text', value }) => (
  <label className="flex w-full flex-col gap-1.5 text-xs font-bold uppercase text-white/65">
    <span>
      {label} {required && <span className="font-serif text-white">*</span>}
    </span>
    <input 
      className="h-11 w-full rounded-lg border border-white/12 bg-black/35 px-3.5 text-sm font-medium tracking-normal text-white normal-case shadow-2xs outline-none transition placeholder:text-white/65 hover:border-white/30 focus:border-white/45 focus:ring-2 focus:ring-white/10" 
      required={required} 
      type={type} 
      value={value} 
      onChange={(event) => onChange(event.target.value)} 
    />
  </label>
)

const primaryButtonClass = 'mt-6 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-black transition hover:shadow-glowSm active:scale-98 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit'
const secondaryButtonClass = 'inline-flex h-9 w-fit cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 px-3 text-xs font-bold text-white/70 shadow-2xs transition hover:border-white/35 hover:text-white active:scale-98'

const normalizeAddresses = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.addresses)) return payload.addresses
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

const getAddressId = (address) => address?._id || address?.id || address?.addressId || ''

const trimAddress = (address) => {
  const clean = {}

  for (const key in address) {
    const value = address[key]
    clean[key] = typeof value === 'string' ? value.trim() : value
  }

  return clean
}
