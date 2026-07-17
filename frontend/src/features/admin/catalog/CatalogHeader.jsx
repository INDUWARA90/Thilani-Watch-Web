import { Plus } from 'lucide-react'

export const CatalogHeader = ({ editingItem, label, onReset, plural }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
    <div>
      {/* Premium Pill Metadata */}
      <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-700/10">
        {plural}
      </span>
      
      {/* Title */}
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {editingItem ? `Edit ${label}` : `Create ${label}`}
      </h2>
      
      {/* Dynamic Subtext */}
      <p className="mt-1 text-sm text-slate-500">
        {editingItem 
          ? `Modify configuration details and update the parameters for this entry.` 
          : `Populate the required fields below to create a new ${label.toLowerCase()} record.`}
      </p>
    </div>

    {/* Tactile Secondary Reset Action */}
    {editingItem && (
      <button 
        className="inline-flex h-11 w-fit cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50" 
        type="button" 
        onClick={onReset}
      >
        <Plus className="h-4 w-4 text-slate-500" />
        <span>New {label}</span>
      </button>
    )}
  </div>
)