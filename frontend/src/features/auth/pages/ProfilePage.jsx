import { useEffect, useState } from 'react'
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
  const { changePassword, updateProfile, user } = useAuth()
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' })
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
      setMessage('Profile updated.')
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to update profile.'))
    } finally {
      setIsSaving(false)
    }
  }

  const savePassword = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSaving(true)
    try {
      await changePassword(passwords)
      setPasswords({ currentPassword: '', newPassword: '' })
      setMessage('Password changed.')
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to change password.'))
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
      setMessage(editingAddressId ? 'Address updated.' : 'Address added.')
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
      setMessage('Address removed.')
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
    <main className="grid gap-6">
      <section className="border border-[#DEE2E6] bg-white p-6 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)] sm:p-8">
        <p className="mb-3 text-sm font-normal text-[#F49006]">Account</p>
        <h1 className="mb-4 text-[42px] font-extrabold leading-tight text-[#121212]">Profile & Addresses</h1>
        <p className="mb-0 text-base leading-7 text-[#212529]">Manage your contact details, password, and saved delivery addresses.</p>
      </section>

      {error && <div className="border border-[#DC3545] bg-red-50 px-4 py-3 font-normal text-[#DC3545]">{error}</div>}
      {message && <div className="border border-[#198754] bg-green-50 px-4 py-3 font-normal text-[#198754]">{message}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <form className="grid gap-4 border border-[#DEE2E6] bg-white p-5" onSubmit={saveProfile}>
          <h2 className="text-xl font-bold text-[#121212]">Profile</h2>
          <Field label="Name" required value={profile.name} onChange={(value) => setProfile((current) => ({ ...current, name: value }))} />
          <Field label="Phone" value={profile.phone} onChange={(value) => setProfile((current) => ({ ...current, phone: value }))} />
          <button className={primaryButtonClass} disabled={isSaving} type="submit">{isSaving && <ButtonSpinner />} Save profile</button>
        </form>

        <form className="grid gap-4 border border-[#DEE2E6] bg-white p-5" onSubmit={savePassword}>
          <h2 className="text-xl font-bold text-[#121212]">Change password</h2>
          <Field label="Current password" required type="password" value={passwords.currentPassword} onChange={(value) => setPasswords((current) => ({ ...current, currentPassword: value }))} />
          <Field label="New password" required type="password" value={passwords.newPassword} onChange={(value) => setPasswords((current) => ({ ...current, newPassword: value }))} />
          <button className={primaryButtonClass} disabled={isSaving} type="submit">{isSaving && <ButtonSpinner />} Change password</button>
        </form>
      </div>

      <section className="grid gap-5 border border-[#DEE2E6] bg-white p-5">
        <h2 className="text-xl font-bold text-[#121212]">Address book</h2>
        {isLoading ? (
          <LoadingState label="Loading addresses" variant="table" rows={3} />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {addresses.map((address) => (
              <article className="grid gap-3 border border-[#DEE2E6] bg-[#F8F9FA] p-4" key={getAddressId(address)}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-[#121212]">{address.label || 'Address'}</strong>
                  {address.isDefault && <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">Default</span>}
                </div>
                <div className="text-sm leading-6 text-[#212529]">
                  <p className="m-0">{address.fullName}</p>
                  <p className="m-0">{address.addressLine1}</p>
                  {address.addressLine2 && <p className="m-0">{address.addressLine2}</p>}
                  <p className="m-0">{[address.city, address.district, address.postalCode].filter(Boolean).join(', ')}</p>
                  <p className="m-0">{address.country}</p>
                  <p className="m-0">{address.phone}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className={secondaryButtonClass} type="button" onClick={() => editAddress(address)}>Edit</button>
                  {!address.isDefault && <button className={secondaryButtonClass} type="button" onClick={() => setDefaultAddress(address)}>Set default</button>}
                  <button className={secondaryButtonClass} type="button" onClick={() => deleteAddress(address)}>Delete</button>
                </div>
              </article>
            ))}
            {addresses.length === 0 && <p className="m-0 text-[#212529]">No saved addresses yet.</p>}
          </div>
        )}

        <form className="grid gap-4 border-t border-[#DEE2E6] pt-5" onSubmit={saveAddress}>
          <h3 className="text-lg font-bold text-[#121212]">{editingAddressId ? 'Edit address' : 'Add address'}</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {addressFields.map(([name, label, type]) => (
              <Field key={name} label={label} required={!['addressLine2', 'district'].includes(name)} type={type} value={addressForm[name]} onChange={(value) => setAddressForm((current) => ({ ...current, [name]: value }))} />
            ))}
          </div>
          <label className="flex min-h-11 items-center gap-3 text-base font-normal text-[#121212]">
            <input checked={addressForm.isDefault} type="checkbox" onChange={(event) => setAddressForm((current) => ({ ...current, isDefault: event.target.checked }))} />
            Use as default address
          </label>
          <div className="flex flex-wrap gap-3">
            <button className={primaryButtonClass} disabled={isSaving} type="submit">{isSaving && <ButtonSpinner />} {editingAddressId ? 'Update address' : 'Add address'}</button>
            {editingAddressId && <button className={secondaryButtonClass} type="button" onClick={() => {
              setEditingAddressId('')
              setAddressForm(emptyAddress)
            }}>Cancel edit</button>}
          </div>
        </form>
      </section>
    </main>
  )
}

const addressFields = [
  ['label', 'Label'],
  ['fullName', 'Full name'],
  ['phone', 'Phone'],
  ['addressLine1', 'Address line 1'],
  ['addressLine2', 'Address line 2'],
  ['city', 'City'],
  ['district', 'District'],
  ['postalCode', 'Postal code'],
  ['country', 'Country'],
]

const Field = ({ label, onChange, required = false, type = 'text', value }) => (
  <label className="grid gap-2 text-base font-normal text-[#121212]">
    {label}
    <input className="min-h-[45px] min-w-0 border border-[#DEE2E6] bg-white px-[15px] text-[#121212] outline-none focus:border-[#0D6EFD] focus:ring-2 focus:ring-[#0D6EFD]/25" required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
  </label>
)

const primaryButtonClass = 'inline-flex min-h-11 w-fit cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#121212] px-8 text-sm font-normal text-white hover:bg-[#272222] disabled:cursor-not-allowed disabled:opacity-65'
const secondaryButtonClass = 'inline-flex min-h-10 w-fit cursor-pointer items-center justify-center rounded-[14px] border border-[#DEE2E6] bg-[rgba(18,18,18,0.04)] px-4 text-sm font-normal text-[#121212] hover:bg-[rgba(18,18,18,0.08)]'

const normalizeAddresses = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.addresses)) return payload.addresses
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

const getAddressId = (address) => address?._id || address?.id || address?.addressId || ''

const trimAddress = (address) =>
  Object.fromEntries(Object.entries(address).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]))
