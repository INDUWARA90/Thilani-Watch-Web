import { useEffect, useState } from 'react'
import { ButtonSpinner, LoadingState } from '@/shared/ui/LoadingState'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { formatDate, formatMoney, getId, getTitle, normalizeList } from '../lib/adminUtils'

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([])
  const [customerOrders, setCustomerOrders] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [pendingId, setPendingId] = useState('')

  const loadCustomers = async (filters = {}) => {
    setError('')
    setIsLoading(true)
    try {
      const payload = await adminApi.getCustomers(filters)
      setCustomers(normalizeList(payload, ['customers', 'users']))
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load customers.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        const payload = await adminApi.getCustomers()
        if (isMounted) {
          setCustomers(normalizeList(payload, ['customers', 'users']))
          setError('')
        }
      } catch (apiError) {
        if (isMounted) {
          setError(getApiErrorMessage(apiError, 'Unable to load customers.'))
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

  const handleSearch = (event) => {
    event.preventDefault()
    loadCustomers({ search })
  }

  const openCustomer = async (customer) => {
    const customerId = getId(customer)
    setPendingId(customerId)
    setError('')
    try {
      const [detail, orders] = await Promise.all([
        adminApi.getCustomer(customerId),
        adminApi.getCustomerOrders(customerId),
      ])
      setSelectedCustomer(detail?.customer || detail?.user || detail || customer)
      setCustomerOrders(normalizeList(orders, ['orders']))
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load customer details.'))
    } finally {
      setPendingId('')
    }
  }

  const toggleCustomerStatus = async (customer) => {
    const customerId = getId(customer)
    setPendingId(customerId)
    setError('')
    try {
      await adminApi.updateCustomerStatus(customerId, customer.isActive === false)
      await loadCustomers({ search })
      if (selectedCustomer && getId(selectedCustomer) === customerId) {
        await openCustomer({ ...customer, isActive: customer.isActive === false })
      }
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to update customer status.'))
    } finally {
      setPendingId('')
    }
  }

  return (
    <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(28,41,56,0.06)] sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-teal-700">Customers</p>
          <h2 className="m-0 text-3xl font-bold leading-tight text-slate-950">Customer accounts</h2>
        </div>
        <form className="flex w-full max-w-md gap-2" onSubmit={handleSearch}>
          <input className={inputClass} placeholder="Search customers" value={search} onChange={(event) => setSearch(event.target.value)} />
          <button className={primaryButtonClass} type="submit">Search</button>
        </form>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="min-w-0">
          {isLoading ? (
            <LoadingState label="Loading customers" variant="table" rows={6} />
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse">
                <thead>
                  <tr>
                    {['Customer', 'Phone', 'Status', 'Joined', 'Actions'].map((heading) => (
                      <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600" key={heading}>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => {
                    const customerId = getId(customer)
                    const isPending = pendingId === customerId

                    return (
                      <tr key={customerId}>
                        <td className="border-b border-slate-200 p-3">
                          <strong className="block text-slate-950">{getTitle(customer, 'Customer')}</strong>
                          <span className="text-sm text-slate-600">{customer.email}</span>
                        </td>
                        <td className="border-b border-slate-200 p-3">{customer.phone || 'Not set'}</td>
                        <td className="border-b border-slate-200 p-3">{customer.isActive === false ? 'Inactive' : 'Active'}</td>
                        <td className="border-b border-slate-200 p-3">{formatDate(customer.createdAt)}</td>
                        <td className="border-b border-slate-200 p-3">
                          <div className="flex flex-wrap gap-2">
                            <button className={smallButtonClass} disabled={isPending} type="button" onClick={() => openCustomer(customer)}>
                              {isPending ? <ButtonSpinner /> : 'View'}
                            </button>
                            <button className={smallButtonClass} disabled={isPending} type="button" onClick={() => toggleCustomerStatus(customer)}>
                              {customer.isActive === false ? 'Activate' : 'Deactivate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {customers.length === 0 && (
                    <tr>
                      <td className="border-b border-slate-200 p-3 text-slate-600" colSpan={5}>No customers found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          {selectedCustomer ? (
            <div className="grid gap-4">
              <div>
                <p className="mb-2 text-xs font-extrabold uppercase text-teal-700">Selected customer</p>
                <h3 className="m-0 text-2xl font-bold text-slate-950">{getTitle(selectedCustomer, 'Customer')}</h3>
                <p className="m-0 text-slate-600">{selectedCustomer.email}</p>
              </div>
              <div className="grid gap-2 text-sm text-slate-700">
                <p className="m-0">Phone: {selectedCustomer.phone || 'Not set'}</p>
                <p className="m-0">Status: {selectedCustomer.isActive === false ? 'Inactive' : 'Active'}</p>
                <p className="m-0">Joined: {formatDate(selectedCustomer.createdAt)}</p>
              </div>
              <div>
                <h4 className="mb-3 text-lg font-bold text-slate-950">Orders</h4>
                <div className="grid gap-2">
                  {customerOrders.map((order) => (
                    <div className="rounded-lg border border-slate-200 bg-white p-3" key={getId(order)}>
                      <div className="flex items-center justify-between gap-3">
                        <strong>{order.orderNumber || getId(order)}</strong>
                        <span className="text-sm text-slate-600">{order.orderStatus || order.status || 'pending'}</span>
                      </div>
                      <p className="m-0 text-sm text-slate-600">{formatMoney(order.totalAmount ?? order.total, order.currency)}</p>
                    </div>
                  ))}
                  {customerOrders.length === 0 && <p className="m-0 text-slate-600">No orders found for this customer.</p>}
                </div>
              </div>
            </div>
          ) : (
            <p className="m-0 text-slate-600">Select a customer to inspect profile and order history.</p>
          )}
        </aside>
      </div>
    </div>
  )
}

const inputClass = 'min-h-10 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15'
const primaryButtonClass = 'inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-extrabold text-white hover:bg-slate-800'
const smallButtonClass = 'inline-flex min-h-8 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-extrabold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-65'
