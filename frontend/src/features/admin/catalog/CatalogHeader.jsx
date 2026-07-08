export const CatalogHeader = ({ editingItem, label, onReset, plural }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-teal-700">{plural}</p>
      <h2 className="m-0 text-3xl font-bold leading-tight text-slate-950">
        {editingItem ? `Edit ${label.toLowerCase()}` : `Create ${label.toLowerCase()}`}
      </h2>
    </div>
    {editingItem && (
      <button className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 font-extrabold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={onReset}>
        New {label.toLowerCase()}
      </button>
    )}
  </div>
)
