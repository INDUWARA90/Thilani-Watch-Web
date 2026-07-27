import { Settings2 } from 'lucide-react'
import { catalogSections } from '../catalog/catalogConfig'
import { CatalogManager } from '../catalog/CatalogManager'

export const AdminCatalogPage = () => (
  <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
    {/* Page-Level Introduction Header */}
    <div className="flex flex-col gap-1 pb-2">
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
        <Settings2 className="h-4.5 w-4.5 text-primary" />
        <span>System Taxonomy</span>
      </div>
      <h1 className="mt-1.5 font-heading text-2xl font-bold tracking-wide text-primary sm:text-3xl">
        Catalog Configuration
      </h1>
    </div>

    <hr className="border-slate-200/60" />

    {/* Section Grid Workspace */}
    <div className="space-y-10">
      {catalogSections.map((section) => (
        <CatalogManager 
          api={section.api} 
          key={section.label} 
          label={section.label} 
          plural={section.plural} 
        />
      ))}
    </div>
  </div>
)
