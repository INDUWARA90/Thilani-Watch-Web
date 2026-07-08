import { toSlug } from '../lib/adminUtils'

export const CatalogForm = ({ editingItem, form, isUploadingImage, label, setForm, submitItem, updateForm, uploadCatalogImage }) => {
  const clearImage = () => {
    setForm((current) => ({ ...current, imageUrl: '' }))
  }

  const handleImageUpload = async (event) => {
    await uploadCatalogImage(event.target.files?.[0])
    event.target.value = ''
  }

  return (
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

      <section className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div>
          <h3 className="text-lg font-black text-slate-950">{label} image</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">Upload one image to Cloudinary or paste the Cloudinary URL above.</p>
        </div>
        <label className="grid gap-2 text-sm font-extrabold text-slate-700">
          Upload one image
          <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" accept="image/*" disabled={isUploadingImage} onChange={handleImageUpload} type="file" />
        </label>
        {form.imageUrl && (
          <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-[80px_minmax(0,1fr)_auto] sm:items-center">
            <img className="h-20 w-20 rounded-lg bg-slate-100 object-cover" src={form.imageUrl} alt={`${label} preview`} />
            <span className="min-w-0 break-all text-sm font-semibold text-slate-600">{form.imageUrl}</span>
            <button className="inline-flex min-h-9 w-fit cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-extrabold text-red-800 hover:bg-red-100" type="button" onClick={clearImage}>
              Remove
            </button>
          </div>
        )}
        {isUploadingImage && <p className="text-sm font-bold text-slate-500">Uploading image to Cloudinary...</p>}
      </section>

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
}
