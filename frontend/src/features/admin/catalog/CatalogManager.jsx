import { useEffect, useState } from 'react'
import { Plus, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { cloudinaryApi } from '@/shared/api/cloudinaryApi'
import { getId, normalizeList } from '../lib/adminUtils'
import { CatalogForm } from './CatalogForm'
import { CatalogTable } from './CatalogTable'
import { buildCatalogPayload, emptyCatalogForm } from './catalogConfig'

export const CatalogManager = ({ api, label, plural }) => {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyCatalogForm)
  const [editingItem, setEditingItem] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const loadItems = async () => {
    setIsLoading(true)
    setError('')
    try {
      const payload = await api.list()
      setItems(normalizeList(payload, [plural.toLowerCase()]))
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, `Unable to load ${plural.toLowerCase()}.`))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        const payload = await api.list()
        if (isMounted) {
          setItems(normalizeList(payload, [plural.toLowerCase()]))
          setError('')
        }
      } catch (apiError) {
        if (isMounted) {
          setError(getApiErrorMessage(apiError, `Unable to load ${plural.toLowerCase()}.`))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [api, plural])

  const resetForm = () => {
    setEditingItem(null)
    setForm(emptyCatalogForm)
  }

  const openCreateForm = () => {
    resetForm()
    setIsFormOpen(true)
  }

  const closeForm = () => {
    if (isUploadingImage) return
    resetForm()
    setIsFormOpen(false)
  }

  const updateForm = (event) => {
    const { checked, name, type, value } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const uploadCatalogImage = async (file) => {
    if (!file) return

    setError('')
    setIsUploadingImage(true)
    try {
      const image = await cloudinaryApi.uploadImage(file)
      setForm((current) => ({ ...current, imageUrl: image.url || '' }))
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, `${label} image upload failed.`))
    } finally {
      setIsUploadingImage(false)
    }
  }

  const editItem = (item) => {
    setEditingItem(item)
    setForm({
      ...emptyCatalogForm,
      ...item,
      sortOrder: String(item.sortOrder ?? 0),
      isActive: item.isActive !== false,
    })
    setIsFormOpen(true)
  }

  const submitItem = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      const payload = buildCatalogPayload(form)
      if (editingItem) {
        await api.update(getId(editingItem), payload)
        setMessage(`${label} updated successfully.`)
      } else {
        await api.create(payload)
        setMessage(`${label} created successfully.`)
      }
      resetForm()
      await loadItems()
      setIsFormOpen(false)
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, `Unable to save ${label.toLowerCase()}.`))
    }
  }

  const deleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return

    try {
      await api.remove(getId(item))
      setMessage(`${label} deleted successfully.`)
      await loadItems()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, `Unable to delete ${label.toLowerCase()}.`))
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Dynamic Alerts Banner Deck */}
      {(error || message) && (
        <div className="space-y-3 transition-all">
          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50/50 px-4 py-3.5 text-sm font-medium text-red-800 shadow-sm">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-3.5 text-sm font-medium text-emerald-800 shadow-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Workspace Frame */}
      <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm space-y-6">
        {/* Header Block */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-700/10">
              {plural} Catalog
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {plural} Directory
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Create, edit, and organize {plural.toLowerCase()} using the database controls below.
            </p>
          </div>
          
          <button
            className="inline-flex h-11 w-fit cursor-pointer items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-teal-700 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={openCreateForm}
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Create {label.toLowerCase()}</span>
          </button>
        </div>

        {/* Database Table Module */}
        <CatalogTable 
          deleteItem={deleteItem} 
          editItem={editItem} 
          isLoading={isLoading} 
          items={items} 
          plural={plural} 
        />
      </section>

      {/* Premium Backdropped Action Drawer (Modal) */}
      {isFormOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm transition-all" 
          role="dialog" 
          aria-modal="true" 
          aria-label={editingItem ? `Edit ${label}` : `Create ${label}`}
        >
          {/* Modal Box */}
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-950/5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-slate-50/50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
                  {plural} Manager
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  {editingItem ? `Edit ${label}` : `Create New ${label}`}
                </h2>
              </div>
              <button
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                aria-label={`Close ${label.toLowerCase()} form`}
                disabled={isUploadingImage}
                onClick={closeForm}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form Viewport */}
            <div className="min-h-0 overflow-y-auto bg-slate-50/30">
              <div className="p-6">
                <CatalogForm
                  editingItem={editingItem}
                  form={form}
                  isUploadingImage={isUploadingImage}
                  label={label}
                  setForm={setForm}
                  submitItem={submitItem}
                  updateForm={updateForm}
                  uploadCatalogImage={uploadCatalogImage}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
