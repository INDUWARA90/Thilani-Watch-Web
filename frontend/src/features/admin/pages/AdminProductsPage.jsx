import { useState } from 'react'
import { Plus, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { useAdminProducts } from '../products/useAdminProducts'
import { WatchFilters } from '../products/WatchFilters'
import { WatchForm } from '../products/WatchForm'
import { WatchTable } from '../products/WatchTable'

const AdminProductsPage = () => {
  usePageTitle('Admin Products | Thilani Watch Web')

  const products = useAdminProducts()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const openCreateForm = () => {
    products.resetForm()
    setIsFormOpen(true)
  }

  const openEditForm = (watch) => {
    products.editWatch(watch)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    if (products.isSaving) return
    products.resetForm()
    setIsFormOpen(false)
  }

  const saveWatch = async () => {
    const isSaved = await products.saveWatch()
    if (isSaved) setIsFormOpen(false)
  }

  return (
    <div className="mx-auto min-w-0 max-w-7xl space-y-6">
      {/* Dynamic Alerts Container */}
      {(products.error || products.message) && (
        <div className="space-y-3 transition-all">
          {products.error && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50/50 px-4 py-3.5 text-sm font-medium text-red-800 shadow-sm">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              <span>{products.error}</span>
            </div>
          )}
          {products.message && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-3.5 text-sm font-medium text-emerald-800 shadow-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <span>{products.message}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="space-y-6 rounded-2xl border border-black/10 bg-[#FFFEFA] p-4 shadow-sm sm:p-6">
        {/* Header Block */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-semibold text-primary ring-1 ring-inset ring-accent/20">
              Inventory Control
            </div>
            <h2 className="mt-2 break-words font-heading text-2xl font-bold tracking-wide text-primary sm:text-3xl">Watch Database</h2>
            <p className="mt-1 text-sm text-primary">
              Update real-time inventory counts and publish states instantly.
            </p>
          </div>
          
          <button
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary active:scale-98 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
            type="button"
            onClick={openCreateForm}
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add watch</span>
          </button>
        </div>

        {/* Filter Toolbar Module */}
        <WatchFilters
          brands={products.brands}
          categories={products.categories}
          filters={products.filters}
          setFilters={products.setFilters}
        />

        {/* Database Grid Table */}
        <WatchTable
          deleteWatch={products.deleteWatch}
          editWatch={openEditForm}
          isLoading={products.isLoading}
          quickStock={products.quickStock}
          togglePublish={products.togglePublish}
          watches={products.visibleWatches}
        />
      </div>

      {/* Premium Backdropped Action Drawer (Modal) */}
      {isFormOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all" 
          role="dialog" 
          aria-modal="true" 
          aria-label={products.editingWatch ? 'Edit watch' : 'Create watch'}
        >
          {/* Modal Container */}
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-[#FFFEFA] shadow-2xl ring-1 ring-black/5 sm:rounded-3xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 border-b border-black/5 bg-[#FAF9F5]/75 px-4 py-4 sm:px-6 sm:py-4.5">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  Specification Editor
                </span>
                <h2 className="mt-0.5 break-words font-heading text-lg font-extrabold tracking-wide text-primary">
                  {products.editingWatch ? 'Edit Watch Details' : 'Catalog New Model'}
                </h2>
              </div>
              <button
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-black/10 bg-[#FFFEFA] text-primary transition-all hover:bg-[#FAF9F5] hover:text-primary active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                aria-label="Close form panel"
                disabled={products.isSaving}
                onClick={closeForm}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form Viewport */}
            <div className="min-h-0 overflow-y-auto bg-[#FAF9F5]/65">
              <div className="p-4 sm:p-6">
                <WatchForm
                  brands={products.brands}
                  categories={products.categories}
                  deleteUploadedImage={products.deleteUploadedImage}
                  editingWatch={products.editingWatch}
                  form={products.form}
                  isSaving={products.isSaving}
                  onReset={openCreateForm}
                  onSave={saveWatch}
                  setForm={products.setForm}
                  uploadImages={products.uploadImages}
                  uploadedImages={products.uploadedImages}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProductsPage


