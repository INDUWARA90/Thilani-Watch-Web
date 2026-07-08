import { getId } from '../adminUtils'

export const CatalogTable = ({ deleteItem, editItem, isLoading, items, plural }) => {
  if (isLoading) return <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 font-bold text-emerald-950">Loading {plural.toLowerCase()}...</div>

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr>
            <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Name</th>
            <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Slug</th>
            <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Sort</th>
            <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Status</th>
            <th className="border-b border-slate-200 p-3 text-left align-top text-xs font-extrabold uppercase text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={getId(item)}>
              <td className="border-b border-slate-200 p-3 text-left align-top">{item.name}</td>
              <td className="border-b border-slate-200 p-3 text-left align-top">{item.slug}</td>
              <td className="border-b border-slate-200 p-3 text-left align-top">{item.sortOrder ?? 0}</td>
              <td className="border-b border-slate-200 p-3 text-left align-top">
                <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-extrabold ${item.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
                  {item.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="border-b border-slate-200 p-3 text-left align-top">
                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex min-h-8 w-fit cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-extrabold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={() => editItem(item)}>
                    Edit
                  </button>
                  <button className="inline-flex min-h-8 w-fit cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-extrabold text-red-800 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={() => deleteItem(item)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td className="border-b border-slate-200 p-3 text-left align-top" colSpan="5">
                No {plural.toLowerCase()} found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
