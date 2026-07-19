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
    <main className="mx-auto w-full max-w-7xl grid gap-8 pb-12 animate-fade-in">
      {/* Page Header */}
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-gradient-to-b from-white to-slate-50/70 p-6 shadow-xl shadow-slate-200/40 sm:p-10">
        <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#F49006] to-amber-500" />
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#F49006]">Account settings</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Profile & Addresses</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
          Manage your account contact details, security credentials, and shipping addresses.
        </p>
      </section>

      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/60 px-4 py-3.5 text-sm font-medium text-red-600 shadow-sm backdrop-blur-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
      {message && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3.5 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          <span>{message}</span>
        </div>
      )}

      {/* Profile Card */}
      <form className="flex flex-col justify-between rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all hover:shadow-md" onSubmit={saveProfile}>
        <div className="grid gap-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-50">
            <div className="rounded-lg bg-amber-50 p-2 text-[#F49006]">
              <User className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Personal Details</h2>
          </div>
          <Field label="Full Name" required value={profile.name} onChange={(value) => setProfile((current) => ({ ...current, name: value }))} />
          <Field label="Phone Number" type="tel" value={profile.phone} onChange={(value) => setProfile((current) => ({ ...current, phone: value }))} />
        </div>
        <button className={primaryButtonClass} disabled={isSaving} type="submit">
          {isSaving && <ButtonSpinner />} Save Profile Changes
        </button>
      </form>

      {/* Address Book Section */}
      <section className="grid gap-6 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="rounded-lg bg-amber-50 p-2 text-[#F49006]">
            <MapPin className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Saved Addresses</h2>
        </div>

        {isLoading ? (
          <LoadingState label="Loading address records" variant="table" rows={2} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((address) => (
              <article className="group relative flex flex-col justify-between rounded-xl border border-slate-200/60 bg-slate-50/40 p-5 transition-all duration-200 hover:border-slate-300 hover:bg-white hover:shadow-md" key={getAddressId(address)}>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center rounded-md bg-white border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-800 tracking-wide shadow-2xs">
                      {address.label || 'Address'}
                    </span>
                    {address.isDefault && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 tracking-wide">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-600 space-y-0.5">
                    <p className="font-semibold text-slate-800">{address.fullName}</p>
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{[address.city, address.district, address.postalCode].filter(Boolean).join(', ')}</p>
                    <p className="text-xs font-medium tracking-wide uppercase text-slate-400 mt-1">{address.country}</p>
                    <p className="text-slate-500 pt-1 font-mono text-xs">{address.phone}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-5 pt-3 border-t border-slate-100">
                  <button className={secondaryButtonClass} type="button" onClick={() => editAddress(address)}>Edit</button>
                  {!address.isDefault && (
                    <button className={secondaryButtonClass} type="button" onClick={() => setDefaultAddress(address)}>Set Default</button>
                  )}
                  <button className={`${secondaryButtonClass} hover:text-red-600 hover:border-red-200 hover:bg-red-50/40`} type="button" onClick={() => deleteAddress(address)}>Delete</button>
                </div>
              </article>
            ))}
            {addresses.length === 0 && (
              <div className="md:col-span-2 text-center py-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
                <p className="text-sm text-slate-400 font-medium">No saved dispatch addresses found.</p>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Address Management Form */}
        <form className="mt-6 border-t border-slate-100 pt-6 space-y-6" onSubmit={saveAddress}>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-slate-900 inline-flex items-center gap-2">
              {editingAddressId ? (
                <>Modify Address Entry</>
              ) : (
                <><Plus className="h-4 w-4 text-[#F49006]" /> Register New Address</>
              )}
            </h3>
            {editingAddressId && (
              <button 
                type="button" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
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

          <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
            <label className="inline-flex items-center gap-3 cursor-pointer select-none group">
              <input 
                checked={addressForm.isDefault} 
                type="checkbox" 
                className="h-4 w-4 rounded border-slate-300 text-[#F49006] focus:ring-[#F49006]/20 transition-all cursor-pointer"
                onChange={(event) => setAddressForm((current) => ({ ...current, isDefault: event.target.checked }))} 
              />
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Set as preferred destination</span>
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
  <label className="flex flex-col gap-1.5 w-full text-xs font-bold tracking-wide uppercase text-slate-500">
    <span>
      {label} {required && <span className="text-amber-500 font-serif">*</span>}
    </span>
    <input 
      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium tracking-normal text-slate-900 normal-case shadow-2xs outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#F49006] focus:ring-4 focus:ring-[#F49006]/10" 
      required={required} 
      type={type} 
      value={value} 
      onChange={(event) => onChange(event.target.value)} 
    />
  </label>
)

const primaryButtonClass = 'mt-6 inline-flex h-11 w-full sm:w-fit cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#F49006] hover:shadow-lg hover:shadow-amber-500/10 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50'
const secondaryButtonClass = 'inline-flex h-9 w-fit cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold tracking-wide text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 active:scale-98'

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
