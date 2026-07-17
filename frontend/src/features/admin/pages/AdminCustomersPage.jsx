import { ButtonSpinner, LoadingState } from '@/shared/ui/LoadingState'
import { useAdminCustomers } from '../hooks/useAdminCustomers'
import { formatDate, formatMoney, getId, getTitle } from '../lib/adminUtils'

export const AdminCustomersPage = () => {
  const {
    customerOrders,
    customers,
    error,
    handleSearch,
    isLoading,
    openCustomer,
    pendingId,
    search,
    selectedCustomer,
    setSearch,
    toggleCustomerStatus,
  } = useAdminCustomers()

  return (
    <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
      {/* Header & Search Bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-teal-600">Admin Dashboard</p>
          <h1 className="m-0 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Customer Management</h1>
        </div>
        <form className="flex w-full max-w-md gap-2" onSubmit={handleSearch}>
          <div className="relative flex-1">
            <input 
              className={inputClass} 
              placeholder="Search by name or email..." 
              value={search} 
              onChange={(event) => setSearch(event.target.value)} 
            />
          </div>
          <button className={primaryButtonClass} type="submit">Search</button>
        </form>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/50 p-4 text-sm font-medium text-red-800 backdrop-blur-sm animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-red-500 shrink-0" />
          {error}
        </div>
      )}

      {/* Main split grid */}
      <div className="grid gap-8 items-start xl:grid-cols-[1fr_400px]">
        {/* Table View Component */}
        <main className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-6"><LoadingState label="Loading accounts..." variant="table" rows={6} /></div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200">
                    {['Customer info', 'Phone number', 'Account status', 'Registration', 'Actions'].map((heading) => (
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500" key={heading}>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((customer) => {
                    const customerId = getId(customer)
                    const isPending = pendingId === customerId
                    const isCurrentSelection = selectedCustomer && getId(selectedCustomer) === customerId
                    const isActive = customer.isActive !== false

                    return (
                      <tr 
                        key={customerId} 
                        className={`transition-colors duration-150 group hover:bg-slate-50/40 ${isCurrentSelection ? 'bg-teal-50/30 hover:bg-teal-50/40' : ''}`}
                      >
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                              {getTitle(customer, 'Customer')}
                            </span>
                            <span className="text-xs text-slate-400 font-mono mt-0.5">{customer.email}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-600 font-medium">
                          {customer.phone || <span className="text-slate-300 italic text-xs">Not configured</span>}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isActive 
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-500">
                          {formatDate(customer.createdAt)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button 
                              className={`${smallButtonClass} ${isCurrentSelection ? 'border-teal-600 bg-teal-50/50 text-teal-700' : ''}`} 
                              disabled={isPending} 
                              type="button" 
                              onClick={() => openCustomer(customer)}
                            >
                              {isPending ? <ButtonSpinner /> : 'Inspect'}
                            </button>
                            <button 
                              className={`${actionButtonClass} ${isActive ? 'hover:text-red-600 hover:bg-red-50' : 'hover:text-emerald-600 hover:bg-emerald-50'}`}
                              disabled={isPending} 
                              type="button" 
                              onClick={() => toggleCustomerStatus(customer)}
                            >
                              {isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {customers.length === 0 && (
                    <tr>
                      <td className="p-8 text-center text-sm text-slate-400" colSpan={5}>
                        No records match the requested parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>

        {/* Inspection Panel Side Drawer / Card */}
        <aside className="sticky top-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6 overflow-hidden">
          {selectedCustomer ? (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Selected Profile</span>
                  <span className={`h-2.5 w-2.5 rounded-full ${selectedCustomer.isActive !== false ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{getTitle(selectedCustomer, 'Customer')}</h3>
                <p className="text-xs font-mono text-slate-400 truncate mt-0.5">{selectedCustomer.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-xs">
                <div>
                  <span className="block font-medium text-slate-400 mb-0.5">Contact Phone</span>
                  <span className="font-semibold text-slate-700 break-words">{selectedCustomer.phone || '—'}</span>
                </div>
                <div>
                  <span className="block font-medium text-slate-400 mb-0.5">Registration</span>
                  <span className="font-semibold text-slate-700">{formatDate(selectedCustomer.createdAt)}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Recent Invoices</h4>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                    {customerOrders.length}
                  </span>
                </div>
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {customerOrders.map((order) => {
                    const status = (order.orderStatus || order.status || 'pending').toLowerCase()
                    const isCompleted = status === 'completed' || status === 'delivered' || status === 'paid'
                    
                    return (
                      <div className="group/order rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm hover:border-slate-200 transition-all duration-150" key={getId(order)}>
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <span className="font-mono text-xs font-bold text-slate-700 group-hover/order:text-teal-700 transition-colors">
                            #{order.orderNumber || getId(order).substring(0, 8)}
                          </span>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                            isCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {status}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {formatMoney(order.totalAmount ?? order.total, order.currency)}
                        </div>
                      </div>
                    )
                  })}
                  {customerOrders.length === 0 && (
                    <div className="text-center py-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                      <p className="text-xs text-slate-400 italic">No historical transactions recorded.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed border-slate-100 rounded-xl">
              <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3 font-bold text-lg">i</div>
              <p className="text-sm text-slate-400 max-w-[200px]">Select a client transaction row to inspect historical metrics.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

// Layout configuration tokens
const inputClass = 'w-full h-10 rounded-xl border border-slate-200 bg-white pl-4 pr-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 outline-none transition-all focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10'
const primaryButtonClass = 'inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors shrink-0'
const smallButtonClass = 'inline-flex h-8 min-w-[64px] cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 transition-all'
const actionButtonClass = 'inline-flex h-8 cursor-pointer items-center justify-center rounded-lg px-2.5 text-xs font-medium text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition-all'
