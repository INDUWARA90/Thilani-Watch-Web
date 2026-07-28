import { ButtonSpinner, LoadingState } from '@/shared/ui/LoadingState'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { useAdminCustomers } from '../hooks/useAdminCustomers'
import { formatDate, formatMoney, getId, getTitle } from '../lib/adminUtils'

export const AdminCustomersPage = () => {
  usePageTitle('Admin Customers | Thilani Watch Web')

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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-black/5 pb-6">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-accent">Admin Dashboard</p>
          <h1 className="m-0 font-heading text-2xl font-black tracking-wide text-primary sm:text-3xl">Customer Management</h1>
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
        <main className="rounded-2xl border border-black/10 bg-[#FFFEFA] shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-6"><LoadingState label="Loading accounts..." variant="table" rows={6} /></div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#FAF9F5]/85 border-b border-black/10">
                    {['Customer info', 'Phone number', 'Account status', 'Registration', 'Actions'].map((heading) => (
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-primary" key={heading}>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {customers.map((customer) => {
                    const customerId = getId(customer)
                    const isPending = pendingId === customerId
                    const isCurrentSelection = selectedCustomer && getId(selectedCustomer) === customerId
                    const isActive = customer.isActive !== false

                    return (
                      <tr 
                        key={customerId} 
                        className={`transition-colors duration-150 group hover:bg-[#FAF9F5]/80 ${isCurrentSelection ? 'bg-accent/10 hover:bg-accent/10' : ''}`}
                      >
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-primary group-hover:text-primary transition-colors">
                              {getTitle(customer, 'Customer')}
                            </span>
                            <span className="text-xs text-primary font-sans mt-0.5">{customer.email}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-primary font-medium">
                          {customer.phone || <span className="text-primary italic text-xs">Not configured</span>}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isActive 
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10' 
                              : 'bg-black/5 text-primary'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-black/35'}`} />
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-primary">
                          {formatDate(customer.createdAt)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button 
                              className={`${smallButtonClass} ${isCurrentSelection ? 'border-primary bg-accent/10/50 text-primary' : ''}`} 
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
                      <td className="p-8 text-center text-sm text-primary" colSpan={5}>
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
        <aside className="sticky top-6 rounded-2xl border border-black/10 bg-[#FFFEFA] shadow-sm p-6 overflow-hidden">
          {selectedCustomer ? (
            <div className="space-y-6">
              <div className="border-b border-black/5 pb-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">Selected Profile</span>
                  <span className={`h-2.5 w-2.5 rounded-full ${selectedCustomer.isActive !== false ? 'bg-emerald-500' : 'bg-black/20'}`} />
                </div>
                <h3 className="font-heading text-xl font-bold tracking-wide text-primary">{getTitle(selectedCustomer, 'Customer')}</h3>
                <p className="text-xs font-sans text-primary truncate mt-0.5">{selectedCustomer.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-xl bg-[#FAF9F5] p-4 text-xs">
                <div>
                  <span className="block font-medium text-primary mb-0.5">Contact Phone</span>
                  <span className="font-semibold text-primary break-words">{selectedCustomer.phone || '—'}</span>
                </div>
                <div>
                  <span className="block font-medium text-primary mb-0.5">Registration</span>
                  <span className="font-semibold text-primary">{formatDate(selectedCustomer.createdAt)}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wide">Recent Invoices</h4>
                  <span className="rounded-md bg-black/5 px-2 py-0.5 text-xs font-bold text-primary">
                    {customerOrders.length}
                  </span>
                </div>
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {customerOrders.map((order) => {
                    const status = (order.orderStatus || order.status || 'pending').toLowerCase()
                    const isCompleted = status === 'completed' || status === 'delivered' || status === 'paid'
                    
                    return (
                      <div className="group/order rounded-xl border border-black/5 bg-[#FFFEFA] p-3.5 shadow-sm hover:border-black/10 transition-all duration-150" key={getId(order)}>
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <span className="font-sans text-xs font-bold text-primary group-hover/order:text-primary transition-colors">
                            #{order.orderNumber || getId(order).substring(0, 8)}
                          </span>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                            isCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {status}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-primary">
                          {formatMoney(order.totalAmount ?? order.total, order.currency)}
                        </div>
                      </div>
                    )
                  })}
                  {customerOrders.length === 0 && (
                    <div className="text-center py-8 rounded-xl border border-dashed border-black/10 bg-[#FAF9F5]/75">
                      <p className="text-xs text-primary italic">No historical transactions recorded.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed border-black/5 rounded-xl">
              <div className="h-10 w-10 rounded-full bg-[#FAF9F5] flex items-center justify-center text-primary mb-3 font-bold text-lg">i</div>
              <p className="text-sm text-primary max-w-[200px]">Select a client transaction row to inspect historical metrics.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

// Layout configuration tokens
const inputClass = 'w-full h-10 rounded-xl border border-black/10 bg-[#FFFEFA] pl-4 pr-3 text-sm text-primary shadow-sm placeholder:text-primary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-accent/20'
const primaryButtonClass = 'inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-black px-5 text-sm font-semibold text-white shadow-sm hover:bg-black/85 transition-colors shrink-0'
const smallButtonClass = 'inline-flex h-8 min-w-[64px] cursor-pointer items-center justify-center rounded-lg border border-black/10 bg-[#FFFEFA] px-3 text-xs font-semibold text-primary shadow-sm hover:bg-[#FAF9F5] hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all'
const actionButtonClass = 'inline-flex h-8 cursor-pointer items-center justify-center rounded-lg px-2.5 text-xs font-medium text-primary hover:bg-[#FAF9F5] disabled:cursor-not-allowed disabled:opacity-50 transition-all'


