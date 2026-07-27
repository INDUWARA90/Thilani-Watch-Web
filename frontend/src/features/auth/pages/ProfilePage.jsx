import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, MapPin, User, Plus, X } from 'lucide-react'
import { ButtonSpinner, LoadingState } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { authApi } from '@/features/auth/api/authApi'
import { SRI_LANKA_PROVINCES } from '@/features/orders/lib/orderUtils'

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
    <main className="min-h-screen bg-base pb-24 text-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-100/80 via-base to-base px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-10 border-b border-black/5">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[700px] rounded-full bg-gradient-to-tr from-amber-200/20 via-orange-100/10 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px] min-w-0">
          <span className="mb-3 inline-flex items-center rounded-full border border-black/10 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black shadow-sm backdrop-blur-md">
            Account settings
          </span>
          <h1 className="break-words font-heading text-[38px] font-extrabold tracking-tight leading-[1.05] text-black sm:text-[54px] lg:text-[68px]">
            Profile & Addresses
          </h1>
          <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-stone-600 sm:text-lg">
            Manage your account contact details, security credentials, and shipping destinations.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-6 lg:px-10 grid gap-8">
        {/* Notifications */}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm font-medium text-red-700 shadow-sm backdrop-blur-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm font-medium text-emerald-800 shadow-sm backdrop-blur-sm">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Profile Card */}
        <form className="flex min-w-0 flex-col justify-between rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)]" onSubmit={saveProfile}>
          <div className="grid gap-6">
            <div className="flex items-center gap-3 border-b border-black/10 pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-stone-800 shadow-inner">
                <User className="h-5 w-5" />
              </div>
              <h2 className="font-heading text-xl font-bold tracking-tight text-black">Personal Details</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full Name" required value={profile.name} onChange={(value) => setProfile((current) => ({ ...current, name: value }))} />
              <Field label="Phone Number" type="tel" value={profile.phone} onChange={(value) => setProfile((current) => ({ ...current, phone: value }))} />
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-black/5 flex justify-end">
            <button className={primaryButtonClass} disabled={isSaving} type="submit">
              {isSaving && <ButtonSpinner />} Save profile changes
            </button>
          </div>
        </form>

        {/* Address Book Section */}
        <section className="grid min-w-0 gap-6 rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 border-b border-black/10 pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-stone-800 shadow-inner">
              <MapPin className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-xl font-bold tracking-tight text-black">Saved Addresses</h2>
          </div>

          {isLoading ? (
            <LoadingState label="Loading address records" variant="table" rows={2} />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {addresses.map((address) => (
                <article className="group relative flex min-w-0 flex-col justify-between rounded-2xl border border-black/10 bg-stone-50/70 p-5.5 transition-all duration-200 hover:border-black/25 hover:bg-white hover:shadow-sm" key={getAddressId(address)}>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className="inline-flex items-center rounded-lg border border-black/10 bg-white px-3 py-1 text-xs font-bold text-black shadow-2xs">
                        {address.label || 'Address'}
                      </span>
                      {address.isDefault && (
                        <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-50 px-3 py-0.5 text-[11px] font-bold text-emerald-800">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 space-y-1 text-sm leading-relaxed text-stone-600">
                      <p className="font-bold text-black">{address.fullName}</p>
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{[address.city, address.district, address.postalCode].filter(Boolean).join(', ')}</p>
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 pt-0.5">{address.country}</p>
                      <p className="pt-1 font-mono text-xs text-stone-700">{address.phone}</p>
                    </div>
                  </div>
                  
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-black/10 pt-4">
                    <button className={secondaryButtonClass} type="button" onClick={() => editAddress(address)}>Edit</button>
                    {!address.isDefault && (
                      <button className={secondaryButtonClass} type="button" onClick={() => setDefaultAddress(address)}>Set default</button>
                    )}
                    <button className={`${secondaryButtonClass} text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500`} type="button" onClick={() => deleteAddress(address)}>Delete</button>
                  </div>
                </article>
              ))}
              {addresses.length === 0 && (
                <div className="rounded-2xl border border-dashed border-black/15 bg-stone-50/50 py-10 text-center md:col-span-2">
                  <p className="text-sm font-medium text-stone-600">No saved dispatch addresses found.</p>
                </div>
              )}
            </div>
          )}

          {/* Dynamic Address Management Form */}
          <form className="mt-6 space-y-6 border-t border-black/10 pt-8" onSubmit={saveAddress}>
            <div className="flex items-center justify-between gap-4">
              <h3 className="inline-flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-black">
                {editingAddressId ? (
                  <>Modify Address Entry</>
                ) : (
                  <><Plus className="h-4 w-4 text-amber-600" /> Register New Address</>
                )}
              </h3>
              {editingAddressId && (
                <button 
                  type="button" 
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 transition hover:text-black cursor-pointer"
                  onClick={() => {
                    setEditingAddressId('')
                    setAddressForm(emptyAddress)
                  }}
                >
                  <X className="h-3.5 w-3.5" /> Cancel edit
                </button>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {addressFields.map(([name, label, type]) => {
                if (name === 'district') {
                  return (
                    <label key={name} className="flex w-full flex-col gap-2 text-xs font-bold uppercase tracking-wider text-black">
                      <span>
                        {label} <span className="text-amber-600">*</span>
                      </span>
                      <select
                        className={inputClass}
                        required
                        value={addressForm[name]}
                        onChange={(event) => setAddressForm((current) => ({ ...current, [name]: event.target.value }))}
                      >
                        <option value="" disabled>Select province</option>
                        {SRI_LANKA_PROVINCES.map((province) => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                    </label>
                  )
                }

                return (
                  <Field 
                    key={name} 
                    label={label} 
                    required={!['addressLine2'].includes(name)} 
                    type={type} 
                    value={addressForm[name]} 
                    onChange={(value) => setAddressForm((current) => ({ ...current, [name]: value }))} 
                  />
                )
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black/5">
              <label className="inline-flex items-center gap-3 cursor-pointer select-none group">
                <input 
                  checked={addressForm.isDefault} 
                  type="checkbox" 
                  className="h-5 w-5 cursor-pointer rounded-md border-black/20 bg-stone-50 text-black accent-black transition-all focus:ring-2 focus:ring-black/10"
                  onChange={(event) => setAddressForm((current) => ({ ...current, isDefault: event.target.checked }))} 
                />
                <span className="text-sm font-bold text-black transition group-hover:text-amber-600">Set as preferred destination</span>
              </label>

              <button className={primaryButtonClass} disabled={isSaving} type="submit">
                {isSaving && <ButtonSpinner />} {editingAddressId ? 'Update address' : 'Add address record'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}

const addressFields = [
  ['label', 'Address Label (e.g., Home, Work)'],
  ['fullName', 'Recipient Full Name'],
  ['phone', 'Contact Number', 'tel'],
  ['addressLine1', 'Street Address Line 1'],
  ['addressLine2', 'Suite, Building, Unit (Optional)'],
  ['city', 'City / Suburb'],
  ['district', 'State / Province / District'],
  ['postalCode', 'Postal / ZIP Code'],
  ['country', 'Country'],
]

const Field = ({ label, onChange, required = false, type = 'text', value }) => (
  <label className="flex w-full flex-col gap-2 text-xs font-bold uppercase tracking-wider text-black">
    <span>
      {label} {required && <span className="text-amber-600">*</span>}
    </span>
    <input 
      className={inputClass} 
      required={required} 
      type={type} 
      value={value} 
      onChange={(event) => onChange(event.target.value)} 
    />
  </label>
)

const inputClass = 'min-h-[46px] min-w-0 w-full rounded-2xl border border-black/15 bg-stone-50/50 px-4 py-2.5 text-sm font-medium text-black normal-case outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10 placeholder:text-stone-400'
const primaryButtonClass = 'inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-black px-8 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all duration-300 hover:bg-stone-800 hover:shadow-xl active:scale-98 disabled:cursor-not-allowed disabled:opacity-60'
const secondaryButtonClass = 'inline-flex h-9 w-fit cursor-pointer items-center justify-center rounded-xl border border-black/15 bg-white px-3.5 text-xs font-bold text-black transition-all hover:bg-stone-50 hover:border-black/30 active:scale-95 shadow-2xs'

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