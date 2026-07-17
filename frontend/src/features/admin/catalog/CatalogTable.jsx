import { Edit2, Trash2, Image as ImageIcon, Inbox, ArrowUpDown } from 'lucide-react'
import { LoadingState } from '@/shared/ui/LoadingState'
import { getId } from '../lib/adminUtils'

export const CatalogTable = ({ deleteItem, editItem, isLoading, items, plural }) => {
  if (isLoading) {
    return <LoadingState label={`Loading ${plural.toLowerCase()}`} variant="table" rows={5} />
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">{plural.slice(0, -1) || 'Item'} details</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Slug URL</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span className="flex items-center gap-1">
                  <ArrowUpDown className="h-3.5 w-3.5" /> Sort Priority
                </span>
              </th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={getId(item)} className="group transition-colors hover:bg-slate-50/50">
                {/* Item Details (Thumbnail + Name) */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                      {item.imageUrl ? (
                        <img 
                          className="h-full w-full object-cover" 
                          src={item.imageUrl} 
                          alt={item.name} 
                        />
                      ) : (
                        <ImageIcon className="m-auto h-4.5 w-4.5 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <strong className="block truncate text-sm font-bold text-slate-900">
                        {item.name}
                      </strong>
                    </div>
                  </div>
                </td>

                {/* Slug Column */}
                <td className="p-4">
                  <span className="font-mono text-xs text-slate-500 bg-slate-100/60 px-2 py-1 rounded-md">
                    {item.slug}
                  </span>
                </td>

                {/* Sort Order */}
                <td className="p-4 text-sm font-semibold text-slate-600">
                  {item.sortOrder ?? 0}
                </td>

                {/* Status Indicator */}
                <td className="p-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                    item.isActive !== false 
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10' 
                      : 'bg-slate-50 text-slate-500 ring-slate-500/10'
                  }`}>
                    {item.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </td>

                {/* Interactive Action Controls */}
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-1.5">
                    {/* Edit Icon */}
                    <button 
                      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-all hover:border-teal-100 hover:bg-teal-50/30 hover:text-teal-600 active:scale-95" 
                      title={`Edit ${plural.slice(0, -1)}`}
                      type="button" 
                      onClick={() => editItem(item)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    {/* Delete Icon */}
                    <button 
                      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-all hover:border-rose-100 hover:bg-rose-50/40 hover:text-rose-600 active:scale-95" 
                      title={`Delete ${plural.slice(0, -1)}`}
                      type="button" 
                      onClick={() => deleteItem(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Styled Empty State */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No {plural.toLowerCase()} listed</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-xs">
            There are currently no items configured in this catalog. Click "Create" above to start adding assets.
          </p>
        </div>
      )}
    </div>
  )
}