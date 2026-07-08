import { toSlug } from '../adminUtils'

export const CatalogForm = ({ editingItem, form, label, setForm, submitItem, updateForm }) => (
  <form className="grid gap-4" onSubmit={submitItem}>
    <div className="grid gap-4 md:grid-cols-2">
      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Name
        <input
          className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15"
          name="name"
          onBlur={() => !form.slug && setForm((current) => ({ ...current, slug: toSlug(current.name) }))}
          onChange={updateForm}
          required
          value={form.name}
        />
      </label>
      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Slug
        <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" name="slug" onChange={updateForm} required value={form.slug} />
      </label>
      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Image URL
        <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" name="imageUrl" onChange={updateForm} value={form.imageUrl} />
      </label>
      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Sort order
        <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" min="0" name="sortOrder" onChange={updateForm} type="number" value={form.sortOrder} />
      </label>
    </div>
    <label className="grid gap-2 text-sm font-extrabold text-slate-700">
      Description
      <textarea className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" name="description" onChange={updateForm} rows="3" value={form.description} />
    </label>
    <div className="flex flex-wrap gap-5">
      <label className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-700">
        <input className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-700" checked={form.isActive} name="isActive" onChange={updateForm} type="checkbox" />
        Active
      </label>
    </div>
    <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center rounded-lg border border-transparent bg-teal-700 px-4 font-extrabold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-65" type="submit">
      {editingItem ? `Update ${label.toLowerCase()}` : `Create ${label.toLowerCase()}`}
    </button>
  </form>
)
