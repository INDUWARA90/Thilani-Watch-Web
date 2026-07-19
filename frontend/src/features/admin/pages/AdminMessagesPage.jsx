import { Mail, Search, Trash2 } from 'lucide-react'
import { ButtonSpinner, LoadingState } from '@/shared/ui/LoadingState'
import { useAdminContactMessages } from '@/features/admin/hooks/useAdminContactMessages'
import { formatDate, getId, readBoolean } from '@/features/admin/lib/adminUtils'

export const AdminMessagesPage = () => {
  const {
    deleteMessage,
    error,
    filters,
    isLoading,
    message,
    messages,
    openMessage,
    pendingId,
    selectedMessage,
    toggleReadStatus,
    updateFilter,
  } = useAdminContactMessages()

  return (
    <div className="mx-auto grid max-w-[1500px] gap-6">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-teal-600">Customer Inbox</p>
          <h1 className="m-0 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Contact Messages</h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative min-w-0 sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className={inputClass}
              placeholder="Search name, email, subject..."
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
            />
          </label>
          <select className={selectClass} value={filters.read} onChange={(event) => updateFilter('read', event.target.value)}>
            <option value="">All messages</option>
            <option value="false">Unread only</option>
            <option value="true">Read only</option>
          </select>
        </div>
      </div>

      {error && <Notice tone="danger">{error}</Notice>}
      {message && <Notice tone="success">{message}</Notice>}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="p-5">
              <LoadingState label="Loading contact messages" variant="reviews" rows={5} />
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {messages.map((contactMessage) => (
                <MessageRow
                  contactMessage={contactMessage}
                  isActive={getId(selectedMessage) === getId(contactMessage)}
                  isPending={pendingId === getId(contactMessage)}
                  key={getId(contactMessage)}
                  onOpen={openMessage}
                />
              ))}
              {messages.length === 0 && (
                <div className="p-10 text-center text-sm font-medium text-slate-400">
                  No contact messages match the selected filters.
                </div>
              )}
            </div>
          )}
        </section>

        <MessageDetail
          contactMessage={selectedMessage}
          isPending={pendingId === getId(selectedMessage)}
          onDelete={deleteMessage}
          onToggleRead={toggleReadStatus}
        />
      </div>
    </div>
  )
}

const MessageRow = ({ contactMessage, isActive, isPending, onOpen }) => {
  const isRead = readBoolean(contactMessage.isRead)

  return (
    <button
      className={`grid w-full cursor-pointer gap-3 p-4 text-left transition hover:bg-slate-50 sm:grid-cols-[minmax(0,1fr)_auto] ${
        isActive ? 'bg-teal-50/40' : 'bg-white'
      } ${isPending ? 'opacity-60' : ''}`}
      type="button"
      onClick={() => onOpen(contactMessage)}
    >
      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${isRead ? 'bg-slate-300' : 'bg-teal-500'}`} />
          <p className="truncate text-sm font-bold text-slate-900">{contactMessage.subject || 'No subject'}</p>
        </div>
        <p className="truncate text-xs font-semibold text-slate-500">
          {contactMessage.name || 'Unknown sender'} • {contactMessage.email}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{contactMessage.message}</p>
      </div>
      <div className="flex items-center gap-2 sm:flex-col sm:items-end">
        <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${isRead ? 'border-slate-200 bg-slate-50 text-slate-500' : 'border-teal-200 bg-teal-50 text-teal-700'}`}>
          {isRead ? 'Read' : 'Unread'}
        </span>
        <span className="text-xs font-medium text-slate-400">{formatDate(contactMessage.createdAt)}</span>
      </div>
    </button>
  )
}

const MessageDetail = ({ contactMessage, isPending, onDelete, onToggleRead }) => {
  if (!contactMessage) {
    return (
      <aside className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-400">
        Select a contact message to inspect it.
      </aside>
    )
  }

  const isRead = readBoolean(contactMessage.isRead)

  return (
    <aside className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="min-w-0">
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600">
            <Mail className="h-4 w-4" />
            Message detail
          </p>
          <h2 className="text-xl font-black leading-tight text-slate-900">{contactMessage.subject || 'No subject'}</h2>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${isRead ? 'border-slate-200 bg-slate-50 text-slate-500' : 'border-teal-200 bg-teal-50 text-teal-700'}`}>
          {isRead ? 'Read' : 'Unread'}
        </span>
      </div>

      <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm">
        <InfoRow label="Name" value={contactMessage.name} />
        <InfoRow label="Email" value={contactMessage.email} />
        <InfoRow label="Phone" value={contactMessage.phone || 'Not provided'} />
        <InfoRow label="Received" value={formatDate(contactMessage.createdAt)} />
      </div>

      <div className="mt-5 rounded-xl border border-slate-100 bg-white p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Message</p>
        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{contactMessage.message}</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button className={secondaryButtonClass} disabled={isPending} type="button" onClick={() => onToggleRead(contactMessage)}>
          {isPending && <ButtonSpinner />}
          {isRead ? 'Mark unread' : 'Mark read'}
        </button>
        <button className={dangerButtonClass} disabled={isPending} type="button" onClick={() => onDelete(contactMessage)}>
          {isPending ? <ButtonSpinner /> : <Trash2 className="h-4 w-4" />}
          Delete
        </button>
      </div>
    </aside>
  )
}

const InfoRow = ({ label, value }) => (
  <div className="grid gap-1">
    <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
    <span className="break-words font-semibold text-slate-800">{value || 'Not provided'}</span>
  </div>
)

const Notice = ({ children, tone }) => (
  <div className={`rounded-xl border p-3.5 text-sm font-semibold ${tone === 'danger' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
    {children}
  </div>
)

const inputClass = 'h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10'
const selectClass = 'h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10'
const secondaryButtonClass = 'inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60'
const dangerButtonClass = 'inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60'
