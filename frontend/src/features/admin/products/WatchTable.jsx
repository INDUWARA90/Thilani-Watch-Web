import { Edit2, Eye, EyeOff, Trash2, Package, Inbox, AlertCircle } from 'lucide-react'
import { LoadingState } from '@/shared/ui/LoadingState'
import { getId, getTitle } from '../lib/adminUtils'

export const WatchTable = ({ deleteWatch, editWatch, isLoading, quickStock, togglePublish, watches }) => {
  if (isLoading) {
    return <LoadingState label="Loading watches" variant="table" rows={6} />
  }

  // Helper to extract a fallback thumbnail if needed
  const getWatchImage = (watch) => {
    if (watch.thumbnail) return watch.thumbnail
    if (typeof watch.images === 'string' && watch.images.trim()) {
      return watch.images.split('\n')[0]
    }
    return null
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Watch Details</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Brand</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Inventory Status</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Visibility</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {watches.map((watch) => {
              const imageSrc = getWatchImage(watch)
              const isOutOfStock = (watch.stockQuantity ?? 0) === 0

              return (
                <tr key={getId(watch)} className="group transition-colors hover:bg-slate-50/50">
                  {/* Watch details & Thumbnail */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                        {imageSrc ? (
                          <img
                            className="h-full w-full object-cover"
                            src={imageSrc}
                            alt={watch.name}
                          />
                        ) : (
                          <Package className="m-auto h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <strong className="block max-w-[18rem] whitespace-normal break-words text-sm font-bold leading-snug text-slate-900">
                          {watch.name}
                        </strong>
                        <span className="font-mono text-xs text-slate-400">
                          {watch.sku || 'No SKU'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Brand */}
                  <td className="p-4 text-sm font-medium text-slate-600">
                    {getTitle(watch.brand) || '—'}
                  </td>

                  {/* Category */}
                  <td className="p-4 text-sm font-medium text-slate-600">
                    {getTitle(watch.category) || '—'}
                  </td>

                  {/* Quick Stock Input & Alert */}
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <input
                        className={`max-w-[76px] rounded-xl border px-2.5 py-1.5 text-center text-sm font-semibold outline-none transition-all focus:ring-4 ${isOutOfStock
                            ? 'border-rose-200 bg-rose-50/30 text-rose-800 focus:border-rose-500 focus:ring-rose-500/10'
                            : 'border-slate-200 bg-white text-slate-900 focus:border-teal-500 focus:ring-teal-500/10'
                          }`}
                        defaultValue={watch.stockQuantity ?? 0}
                        min="0"
                        onBlur={(event) => quickStock(watch, event.target.value)}
                        type="number"
                      />
                      {isOutOfStock && (
                        <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-600">
                          <AlertCircle className="h-3.5 w-3.5" /> Out of stock
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Publish Status Badge */}
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${watch.isPublished
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'
                        : 'bg-slate-50 text-slate-500 ring-slate-500/10'
                      }`}>
                      {watch.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>

                  {/* Interactive Action Controls */}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      {/* Toggle Publish Icon */}
                      <button
                        className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition-all active:scale-95 ${watch.isPublished
                            ? 'border-slate-200 bg-white text-slate-400 hover:text-amber-600 hover:border-amber-100 hover:bg-amber-50/30'
                            : 'border-slate-200 bg-white text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50/30'
                          }`}
                        title={watch.isPublished ? 'Unpublish Product' : 'Publish Product'}
                        type="button"
                        onClick={() => togglePublish(watch)}
                      >
                        {watch.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>

                      {/* Edit Icon */}
                      <button
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-all hover:border-teal-100 hover:bg-teal-50/30 hover:text-teal-600 active:scale-95"
                        title="Edit Product"
                        type="button"
                        onClick={() => editWatch(watch)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      {/* Delete Icon */}
                      <button
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-all hover:border-rose-100 hover:bg-rose-50/40 hover:text-rose-600 active:scale-95"
                        title="Delete Product"
                        type="button"
                        onClick={() => deleteWatch(watch)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Structured Empty State */}
      {watches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No products found</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-xs">
            Try adjusting your search terms or filter combinations to locate matching inventory.
          </p>
        </div>
      )}
    </div>
  )
}
