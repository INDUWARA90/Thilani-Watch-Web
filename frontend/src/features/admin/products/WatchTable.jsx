import { getId, getTitle } from '../adminUtils'

export const WatchTable = ({ deleteWatch, editWatch, isLoading, quickStock, togglePublish, watches }) => {
  if (isLoading) {
    return <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 font-bold text-emerald-950">Loading watches...</div>
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr>
            <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Watch</th>
            <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Brand</th>
            <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Category</th>
            <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Stock</th>
            <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Status</th>
            <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {watches.map((watch) => (
            <tr key={getId(watch)}>
              <td className="border-b border-slate-200 p-3 text-left align-top">
                <strong>{watch.name}</strong>
                <span className="block text-sm text-slate-500">{watch.sku}</span>
              </td>
              <td className="border-b border-slate-200 p-3 text-left align-top">{getTitle(watch.brand)}</td>
              <td className="border-b border-slate-200 p-3 text-left align-top">{getTitle(watch.category)}</td>
              <td className="border-b border-slate-200 p-3 text-left align-top">
                <input
                  className="max-w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15"
                  defaultValue={watch.stockQuantity ?? 0}
                  min="0"
                  onBlur={(event) => quickStock(watch, event.target.value)}
                  type="number"
                />
              </td>
              <td className="border-b border-slate-200 p-3 text-left align-top">
                <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-extrabold ${watch.isPublished ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
                  {watch.isPublished ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="border-b border-slate-200 p-3 text-left align-top">
                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex min-h-8 w-fit cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-extrabold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={() => editWatch(watch)}>
                    Edit
                  </button>
                  <button className="inline-flex min-h-8 w-fit cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-extrabold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={() => togglePublish(watch)}>
                    {watch.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className="inline-flex min-h-8 w-fit cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-extrabold text-red-800 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={() => deleteWatch(watch)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {watches.length === 0 && (
            <tr>
              <td className="border-b border-slate-200 p-3 text-left align-top" colSpan="6">
                No watches found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
