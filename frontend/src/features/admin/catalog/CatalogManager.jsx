import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { cloudinaryApi } from '@/shared/api/cloudinaryApi'
import { getId, normalizeList } from '../lib/adminUtils'
import { CatalogForm } from './CatalogForm'
import { CatalogTable } from './CatalogTable'
import { buildCatalogPayload, emptyCatalogForm } from './catalogConfig'

export const CatalogManager = ({ api, label, plural }) => {
  const [form, setForm] = useState(emptyCatalogForm)
  const [editingItem, setEditingItem] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const queryClient = useQueryClient()
  const catalogKey = useMemo(() => ['admin', 'catalog', plural.toLowerCase()], [plural])
  const itemsQuery = useQuery({
    queryKey: catalogKey,
    queryFn: api.list,
    select: (payload) => normalizeList(payload, [plural.toLowerCase()]),
  })
  const saveItemMutation = useMutation({
    mutationFn: ({ id, payload }) => (id ? api.update(id, payload) : api.create(payload)),
    onSuccess: async (_data, { id }) => {
      setMessage(`${label} ${id ? 'updated' : 'created'} successfully.`)
      resetForm()
      setIsFormOpen(false)
      await queryClient.invalidateQueries({ queryKey: catalogKey })
    },
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, `Unable to save ${label.toLowerCase()}.`))
    },
  })
  const deleteItemMutation = useMutation({
    mutationFn: (item) => api.remove(getId(item)),
    onSuccess: async () => {
      setMessage(`${label} deleted successfully.`)
      await queryClient.invalidateQueries({ queryKey: catalogKey })
    },
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, `Unable to delete ${label.toLowerCase()}.`))
    },
  })

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
    await saveItemMutation.mutateAsync({ id: getId(editingItem), payload: buildCatalogPayload(form) })
  }

  const deleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return
    await deleteItemMutation.mutateAsync(item)
  }

  const loadError = itemsQuery.error ? getApiErrorMessage(itemsQuery.error, `Unable to load ${plural.toLowerCase()}.`) : ''
  const items = itemsQuery.data ?? []

  return (
    <div className="mx-auto min-w-0 max-w-7xl space-y-6">
      {/* Dynamic Alerts Banner Deck */}
      {(error || loadError || message) && (
        <div className="space-y-3 transition-all">
          {(error || loadError) && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50/50 px-4 py-3.5 text-sm font-medium text-red-800 shadow-sm">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              <span>{error || loadError}</span>
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
      <section className="space-y-6 rounded-2xl border border-black/10 bg-[#FFFEFA] p-4 shadow-sm sm:p-6">
        {/* Header Block */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-primary ring-1 ring-inset ring-accent/20">
              {plural} Catalog
            </span>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-wide text-primary sm:text-3xl">
              {plural} Directory
            </h2>
            <p className="mt-1 text-sm text-primary">
              Create, edit, and organize {plural.toLowerCase()} using the database controls below.
            </p>
          </div>
          
          <button
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary active:scale-98 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
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
          isLoading={itemsQuery.isLoading} 
          items={items} 
          plural={plural} 
        />
      </section>

      {/* Premium Backdropped Action Drawer (Modal) */}
      {isFormOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all" 
          role="dialog" 
          aria-modal="true" 
          aria-label={editingItem ? `Edit ${label}` : `Create ${label}`}
        >
          {/* Modal Box */}
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-[#FFFEFA] shadow-2xl ring-1 ring-black/5 sm:rounded-3xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 border-b border-black/5 bg-[#FAF9F5]/75 px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  {plural} Manager
                </span>
                <h2 className="mt-0.5 font-heading text-lg font-extrabold tracking-wide text-primary">
                  {editingItem ? `Edit ${label}` : `Create New ${label}`}
                </h2>
              </div>
              <button
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-black/10 bg-[#FFFEFA] text-primary transition-all hover:bg-[#FAF9F5] hover:text-primary active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                aria-label={`Close ${label.toLowerCase()} form`}
                disabled={isUploadingImage}
                onClick={closeForm}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form Viewport */}
            <div className="min-h-0 overflow-y-auto bg-[#FAF9F5]/65">
              <div className="p-4 sm:p-6">
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


