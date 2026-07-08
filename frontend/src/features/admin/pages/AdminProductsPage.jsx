import { useAdminProducts } from '../products/useAdminProducts'
import { WatchFilters } from '../products/WatchFilters'
import { WatchForm } from '../products/WatchForm'
import { WatchTable } from '../products/WatchTable'

export const AdminProductsPage = () => {
  const products = useAdminProducts()

  return (
    <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(28,41,56,0.06)] sm:p-7">
      <WatchForm
        brands={products.brands}
        categories={products.categories}
        deleteUploadedImage={products.deleteUploadedImage}
        editingWatch={products.editingWatch}
        form={products.form}
        isSaving={products.isSaving}
        onReset={products.resetForm}
        onSave={products.saveWatch}
        setForm={products.setForm}
        uploadImages={products.uploadImages}
        uploadedImages={products.uploadedImages}
      />

      {products.error && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{products.error}</div>}
      {products.message && <div className="rounded-lg border border-green-200 bg-green-50 px-3.5 py-3 font-bold text-green-800">{products.message}</div>}

      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-teal-700">Inventory</p>
            <h2 className="m-0 text-3xl font-bold leading-tight text-slate-950">Watch list</h2>
          </div>
        </div>

        <WatchFilters
          brands={products.brands}
          categories={products.categories}
          filters={products.filters}
          setFilters={products.setFilters}
        />

        <WatchTable
          deleteWatch={products.deleteWatch}
          editWatch={products.editWatch}
          isLoading={products.isLoading}
          quickStock={products.quickStock}
          togglePublish={products.togglePublish}
          watches={products.visibleWatches}
        />
      </div>
    </div>
  )
}
