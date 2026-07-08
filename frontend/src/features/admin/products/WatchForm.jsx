import { getId, getTitle, toSlug } from '../adminUtils'
import { watchTextFields } from './watchFormModel'

export const WatchForm = ({
  brands,
  categories,
  deleteUploadedImage,
  editingWatch,
  form,
  isSaving,
  onReset,
  onSave,
  setForm,
  uploadImages,
  uploadedImages,
}) => {
  const updateForm = (event) => {
    const { checked, name, type, value } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleNameBlur = () => {
    if (!form.slug && form.name) {
      setForm((current) => ({ ...current, slug: toSlug(current.name) }))
    }
  }

  const handleUpload = async (event) => {
    await uploadImages(Array.from(event.target.files || []))
    event.target.value = ''
  }

  const submitWatch = async (event) => {
    event.preventDefault()
    await onSave()
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-teal-700">Products</p>
          <h2 className="m-0 text-3xl font-bold leading-tight text-slate-950">{editingWatch ? 'Edit watch' : 'Create watch'}</h2>
        </div>
        {editingWatch && (
          <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 font-extrabold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={onReset}>
            New watch
          </button>
        )}
      </div>

      <form className="grid gap-4" onSubmit={submitWatch}>
        <div className="grid gap-4 md:grid-cols-2">
          {watchTextFields.map(([name, label, required, type]) => (
            <label className="grid gap-2 text-sm font-extrabold text-slate-700" key={name}>
              {label}
              <input
                className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15"
                min={type === 'number' ? 0 : undefined}
                name={name}
                onBlur={name === 'name' ? handleNameBlur : undefined}
                onChange={updateForm}
                required={required}
                type={type || 'text'}
                value={form[name]}
              />
            </label>
          ))}

          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Brand
            <select className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" name="brand" value={form.brand} onChange={updateForm} required>
              <option value="">Select brand</option>
              {brands.map((brand) => (
                <option key={getId(brand)} value={getId(brand)}>
                  {getTitle(brand)}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Category
            <select className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" name="category" value={form.category} onChange={updateForm} required>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={getId(category)} value={getId(category)}>
                  {getTitle(category)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-extrabold text-slate-700">
          Short description
          <textarea className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" name="shortDescription" value={form.shortDescription} onChange={updateForm} rows="2" />
        </label>

        <label className="grid gap-2 text-sm font-extrabold text-slate-700">
          Description
          <textarea className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" name="description" value={form.description} onChange={updateForm} rows="4" />
        </label>

        <label className="grid gap-2 text-sm font-extrabold text-slate-700">
          Images
          <textarea className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" name="images" value={form.images} onChange={updateForm} rows="4" />
        </label>

        <label className="grid gap-2 text-sm font-extrabold text-slate-700">
          Upload watch images
          <input className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" accept="image/*" multiple onChange={handleUpload} type="file" />
          <span className="text-sm font-semibold text-slate-500">Up to 5 images per upload request.</span>
        </label>

        {uploadedImages.length > 0 && (
          <div className="grid gap-2.5">
            {uploadedImages.map((image) => (
              <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between" key={image.publicId || image.public_id || image.url}>
                <span className="min-w-0 break-all text-sm text-slate-600">{image.url || image.path}</span>
                <button className="inline-flex min-h-8 w-fit cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-extrabold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={() => deleteUploadedImage(image)}>
                  Delete upload
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-5">
          <label className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-700">
            <input className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-700" checked={form.isFeatured} name="isFeatured" onChange={updateForm} type="checkbox" />
            Featured
          </label>
          <label className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-700">
            <input className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-700" checked={form.isPublished} name="isPublished" onChange={updateForm} type="checkbox" />
            Published
          </label>
        </div>

        <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center rounded-lg border border-transparent bg-teal-700 px-4 font-extrabold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-65" disabled={isSaving} type="submit">
          {isSaving ? 'Saving...' : editingWatch ? 'Update watch' : 'Create watch'}
        </button>
      </form>
    </>
  )
}
