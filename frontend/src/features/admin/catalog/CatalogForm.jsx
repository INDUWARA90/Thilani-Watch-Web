import { UploadCloud, Image as ImageIcon, Trash2, ArrowRight, Loader2 } from 'lucide-react'
import { toSlug } from '../lib/adminUtils'

export const CatalogForm = ({ editingItem, form, isUploadingImage, label, setForm, submitItem, updateForm, uploadCatalogImage }) => {
  const clearImage = () => {
    setForm((current) => ({ ...current, imageUrl: '' }))
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (file) {
      await uploadCatalogImage(file)
    }
    event.target.value = ''
  }

  return (
    <form className="space-y-6" onSubmit={submitItem}>
      {/* Primary Details Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
          Name
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-primary outline-none transition-all placeholder:text-primary focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/20"
            name="name"
            placeholder="e.g. Chronograph Classic"
            onBlur={() => !form.slug && setForm((current) => ({ ...current, slug: toSlug(current.name) }))}
            onChange={updateForm}
            required
            value={form.name}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
          Slug (Auto-generated)
          <input 
            className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 font-sans text-sm text-primary outline-none transition-all focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/20" 
            name="slug" 
            placeholder="chronograph-classic"
            onChange={updateForm} 
            required 
            value={form.slug} 
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
          Image URL (Direct Link)
          <input 
            className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-primary outline-none transition-all placeholder:text-primary focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/20" 
            name="imageUrl" 
            placeholder="https://res.cloudinary.com/..."
            onChange={updateForm} 
            value={form.imageUrl} 
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
          Sort Order
          <input 
            className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-primary outline-none transition-all focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/20" 
            min="0" 
            name="sortOrder" 
            onChange={updateForm} 
            type="number" 
            value={form.sortOrder} 
          />
        </label>
      </div>

      {/* Asset Manager Section */}
      <div className="rounded-2xl border border-slate-200/70 bg-slate-50/50 p-5 space-y-4">
        <div>
          <h3 className="flex items-center gap-1.5 font-heading text-sm font-bold tracking-wide text-primary">
            <ImageIcon className="h-4 w-4 text-primary" />
            <span>{label} Media Asset</span>
          </h3>
          <p className="mt-1 text-xs text-primary">
            Upload an image directly to your Cloudinary storage, or paste a structured CDN URL above.
          </p>
        </div>

        {/* Custom Upload Area */}
        <div className="relative">
          <label className={`flex flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-all cursor-pointer ${
            isUploadingImage 
              ? 'border-slate-200 bg-slate-100/50 pointer-events-none' 
              : 'border-slate-300 hover:border-accent hover:bg-accent/10'
          }`}>
            <input 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              accept="image/*" 
              disabled={isUploadingImage} 
              onChange={handleImageUpload} 
              type="file" 
            />
            {isUploadingImage ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
                <span className="text-xs font-semibold text-primary">Uploading media...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <UploadCloud className="h-6 w-6 text-primary group-hover:text-accent" />
                <span className="text-xs font-semibold text-primary">Click to upload brand asset</span>
                <span className="text-[10px] text-primary">Supports PNG, JPG, WEBP</span>
              </div>
            )}
          </label>
        </div>

        {/* Active Upload Preview */}
        {form.imageUrl && (
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <img 
              className="h-14 w-14 rounded-lg bg-slate-50 object-cover border border-slate-100" 
              src={form.imageUrl} 
              alt={`${label} preview`} 
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">Active URL</p>
              <p className="truncate text-xs font-sans text-primary mt-0.5">{form.imageUrl}</p>
            </div>
            <button 
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-rose-100 bg-rose-50/30 text-rose-600 transition-all hover:bg-rose-50 hover:text-rose-700 active:scale-95" 
              type="button" 
              onClick={clearImage}
              title="Remove image"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Description Field */}
      <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
        Description
        <textarea 
          className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-primary outline-none transition-all placeholder:text-primary focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/20" 
          name="description" 
          placeholder={`Describe this ${label.toLowerCase()}...`}
          onChange={updateForm} 
          rows={3} 
          value={form.description} 
        />
      </label>

      {/* Checkboxes & Submits Container */}
      <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
          <input 
            className="h-4.5 w-4.5 rounded border-slate-300 text-accent focus:ring-accent/20 focus:ring-offset-0 focus:ring-4 transition-all" 
            checked={form.isActive} 
            name="isActive" 
            onChange={updateForm} 
            type="checkbox" 
          />
          <span className="text-sm font-semibold text-primary">Publish as active asset</span>
        </label>

        <button 
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary active:scale-98 disabled:cursor-not-allowed disabled:opacity-50" 
          type="submit"
        >
          <span>{editingItem ? `Update ${label}` : `Create ${label}`}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}
