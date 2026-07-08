import { catalogSections } from '../catalog/catalogConfig'
import { CatalogManager } from '../catalog/CatalogManager'

export const AdminCatalogPage = () => (
  <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(28,41,56,0.06)] sm:p-7">
    {catalogSections.map((section) => (
      <CatalogManager api={section.api} key={section.label} label={section.label} plural={section.plural} />
    ))}
  </div>
)
