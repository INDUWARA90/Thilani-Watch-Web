import { BadgeCheck } from 'lucide-react'
import { usePageTitle } from '@/shared/hooks/usePageTitle'
import { brandCatalogSection } from '../catalog/catalogConfig'
import { CatalogManager } from '../catalog/CatalogManager'

const AdminBrandsPage = () => {
  usePageTitle('Admin Brands | Thilani Watch Web')

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-1 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
          <BadgeCheck className="h-4.5 w-4.5 text-primary" />
          <span>Brand Directory</span>
        </div>
        <h1 className="mt-1.5 font-heading text-2xl font-bold tracking-wide text-primary sm:text-3xl">
          Brand Manager
        </h1>
      </div>

      <hr className="border-black/10" />

      <CatalogManager
        api={brandCatalogSection.api}
        label={brandCatalogSection.label}
        plural={brandCatalogSection.plural}
      />
    </div>
  )
}

export default AdminBrandsPage
