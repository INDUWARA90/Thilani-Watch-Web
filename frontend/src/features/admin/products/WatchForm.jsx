import { ButtonSpinner } from '@/shared/ui/LoadingState'
import { 
  Plus, 
  Trash2, 
  Upload, 
  Link2, 
  RotateCcw, 
  Sparkles,
  Info,
  Check
} from 'lucide-react'
import { getId, getTitle, toSlug } from '../lib/adminUtils'
import { mergeImageUrls, splitImageUrls, watchTextFields } from './watchFormModel'

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

  const addImageUrl = () => {
    setForm((current) => {
      const nextImages = mergeImageUrls(current.images, [current.imageUrlDraft])
      const [firstImage] = splitImageUrls(nextImages)

      return {
        ...current,
        imageUrlDraft: '',
        images: nextImages,
        thumbnail: current.thumbnail || firstImage || '',
      }
    })
  }

  const removeImageUrl = (url) => {
    setForm((current) => {
      const images = splitImageUrls(current.images).filter((item) => item !== url)

      return {
        ...current,
        images: images.join('\n'),
        thumbnail: current.thumbnail === url ? images[0] || '' : current.thumbnail,
      }
    })
  }

  const submitWatch = async (event) => {
    event.preventDefault()
    await onSave()
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-700/10">
            Inventory System
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {editingWatch ? 'Edit Watch Specifications' : 'Catalog New Watch'}
          </h2>
          <p className="text-sm text-slate-500">Specify details, metadata, and upload media assets.</p>
        </div>
        {editingWatch && (
          <button 
            className="inline-flex h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-98" 
            type="button" 
            onClick={onReset}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Discard & Create New</span>
          </button>
        )}
      </div>

      <form className="space-y-8" onSubmit={submitWatch}>
        {/* Section 1: Specifications */}
        <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-slate-900">1. Watch Specifications</h3>
          
          <div className="grid gap-5 sm:grid-cols-2">
            {watchTextFields.map(([name, label, required, type]) => (
              <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700" key={name}>
                <span className="flex items-center gap-1">
                  {label}
                  {required && <span className="text-red-500">*</span>}
                </span>
                <input
                  className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
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

            {/* Select Menus */}
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              <span>Brand <span className="text-red-500">*</span></span>
              <select className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" name="brand" value={form.brand} onChange={updateForm} required>
                <option value="">Select brand</option>
                {brands.map((brand) => (
                  <option key={getId(brand)} value={getId(brand)}>
                    {getTitle(brand)}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              <span>Category <span className="text-red-500">*</span></span>
              <select className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" name="category" value={form.category} onChange={updateForm} required>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={getId(category)} value={getId(category)}>
                    {getTitle(category)}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
              <span>Gender Focus</span>
              <select className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" name="gender" value={form.gender} onChange={updateForm}>
                <option value="gents">Gents</option>
                <option value="ladies">Ladies</option>
                <option value="unisex">Unisex</option>
              </select>
            </label>
          </div>
        </section>

        {/* Section 2: Copywriting */}
        <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-slate-900">2. Marketing & Description</h3>
          
          <div className="space-y-5">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              <span>Short Description</span>
              <textarea 
                className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" 
                name="shortDescription" 
                value={form.shortDescription} 
                onChange={updateForm} 
                rows={2} 
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              <span>Detailed Product Story</span>
              <textarea 
                className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" 
                name="description" 
                value={form.description} 
                onChange={updateForm} 
                rows={4} 
              />
            </label>
          </div>
        </section>

        {/* Section 3: Media Hub */}
        <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">3. Media Assets Manager</h3>
            <p className="text-xs text-slate-400 mt-1">Associate imagery strings directly or use Cloudinary pipelines.</p>
          </div>

          <div className="space-y-6">
            {/* Raw URL list */}
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              <span className="flex items-center gap-1.5">
                <Link2 className="h-4 w-4 text-slate-400" /> Image Assets (Active Order)
              </span>
              <textarea 
                className="font-mono rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" 
                name="images" 
                value={form.images} 
                onChange={updateForm} 
                rows={3} 
              />
              <span className="text-xs text-slate-400">One URL parsed per line. Sent natively to watch records.</span>
            </label>

            {/* Upload Zone & Draft Utilities */}
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-5 space-y-5">
              {/* Draft paste */}
              <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <span>Manually Register Cloudinary Link</span>
                <div className="flex gap-2 mt-1.5">
                  <input
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                    name="imageUrlDraft"
                    placeholder="https://res.cloudinary.com/..."
                    type="url"
                    value={form.imageUrlDraft}
                    onChange={updateForm}
                  />
                  <button 
                    className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95" 
                    type="button" 
                    onClick={addImageUrl}
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
              </label>

              {/* Styled File Dropzone */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Upload Raw Watch Images</span>
                <label className="group mt-2.5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-6 text-center transition-all hover:border-teal-500/40 hover:bg-slate-50/30">
                  <Upload className="mb-2 h-6 w-6 text-slate-400 transition-colors group-hover:text-teal-600" />
                  <span className="text-xs font-semibold text-slate-700">Click to upload raw assets</span>
                  <span className="mt-0.5 text-[10px] text-slate-400">Maximum 5 items per transaction. Added automatically.</span>
                  <input className="hidden" accept="image/*" multiple onChange={handleUpload} type="file" />
                </label>
              </div>

              {/* Dynamic Previews */}
              {splitImageUrls(form.images).length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200/50">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Linked Previews</span>
                  <div className="grid gap-2">
                    {splitImageUrls(form.images).map((url) => (
                      <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-2" key={url}>
                        <img className="h-12 w-12 rounded-lg bg-slate-50 object-cover border border-slate-100" src={url} alt="Watch preview" />
                        <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-slate-400">{url}</span>
                        <button 
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all" 
                          type="button" 
                          onClick={() => removeImageUrl(url)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Server Cleanups */}
        {uploadedImages.length > 0 && (
          <section className="rounded-2xl border border-red-100 bg-red-50/10 p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-800 mb-3 flex items-center gap-1.5">
              <Info className="h-4 w-4" /> Session Upload Cache
            </h4>
            <div className="grid gap-2">
              {uploadedImages.map((image) => (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-red-100/50 bg-white p-3 text-xs" key={image.publicId || image.public_id || image.url}>
                  <span className="truncate font-mono text-slate-400">{image.url || image.path}</span>
                  <button 
                    className="inline-flex h-8 cursor-pointer items-center justify-center rounded-lg bg-red-50 px-3 font-semibold text-red-600 transition-all hover:bg-red-100" 
                    type="button" 
                    onClick={() => deleteUploadedImage(image)}
                  >
                    Delete upload
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 4: Visibility Flags & Save */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-6">
            <label className="inline-flex cursor-pointer items-center gap-2.5 select-none">
              <div className="relative flex items-center">
                <input 
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-200 bg-slate-50 transition-all checked:border-teal-600 checked:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/10" 
                  checked={form.isFeatured} 
                  name="isFeatured" 
                  onChange={updateForm} 
                  type="checkbox" 
                />
                <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
              </div>
              <span className="text-sm font-semibold text-slate-700">Feature on Homepage</span>
            </label>

            <label className="inline-flex cursor-pointer items-center gap-2.5 select-none">
              <div className="relative flex items-center">
                <input 
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-200 bg-slate-50 transition-all checked:border-teal-600 checked:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/10" 
                  checked={form.isPublished} 
                  name="isPublished" 
                  onChange={updateForm} 
                  type="checkbox" 
                />
                <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
              </div>
              <span className="text-sm font-semibold text-slate-700">Publish Immediately</span>
            </label>
          </div>

          <button 
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 font-bold text-white transition-all hover:bg-teal-700 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50" 
            disabled={isSaving} 
            type="submit"
          >
            {isSaving ? <ButtonSpinner /> : <Sparkles className="h-4 w-4" />}
            <span>{isSaving ? 'Saving Specifications' : editingWatch ? 'Update Watch Specification' : 'Save & Publish Watch'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
