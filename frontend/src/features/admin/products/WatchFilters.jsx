import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react'
import { getId, getTitle } from '../lib/adminUtils'

export const WatchFilters = ({ brands, categories, filters, setFilters }) => {
  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  const hasActiveFilters = Object.values(filters).some((val) => val !== '')

  const handleReset = () => {
    setFilters({
      search: '',
      stock: '',
      brand: '',
      category: '',
      gender: '',
      featured: '',
      published: '',
    })
  }

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm space-y-4">
      {/* Control Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <span>Filter Inventory</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 transition-colors hover:text-teal-800 focus:outline-none"
            type="button"
          >
            <RotateCcw className="h-3 w-3" />
            Reset active filters
          </button>
        )}
      </div>

      {/* Inputs Deck */}
      <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3">
        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50/40 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
            placeholder="Search watches..."
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
          />
        </div>

        {/* Stock Select */}
        <div className="relative">
          <select 
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" 
            value={filters.stock} 
            onChange={(event) => updateFilter('stock', event.target.value)}
          >
            <option value="">Any stock status</option>
            <option value="true">In stock</option>
            <option value="false">Out of stock</option>
          </select>
        </div>

        {/* Brand Select */}
        <div className="relative">
          <select 
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" 
            value={filters.brand} 
            onChange={(event) => updateFilter('brand', event.target.value)}
          >
            <option value="">Any brand</option>
            {brands.map((brand) => (
              <option key={getId(brand)} value={getTitle(brand)}>
                {getTitle(brand)}
              </option>
            ))}
          </select>
        </div>

        {/* Category Select */}
        <div className="relative">
          <select 
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" 
            value={filters.category} 
            onChange={(event) => updateFilter('category', event.target.value)}
          >
            <option value="">Any category</option>
            {categories.map((category) => (
              <option key={getId(category)} value={getId(category)}>
                {getTitle(category)}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Select */}
        <div className="relative">
          <select
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
            value={filters.gender}
            onChange={(event) => updateFilter('gender', event.target.value)}
          >
            <option value="">Any gender</option>
            <option value="ladies">Ladies</option>
            <option value="gents">Gents</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        {/* Featured Select */}
        <div className="relative">
          <select 
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" 
            value={filters.featured} 
            onChange={(event) => updateFilter('featured', event.target.value)}
          >
            <option value="">Any promotion</option>
            <option value="true">Featured only</option>
            <option value="false">Standard only</option>
          </select>
        </div>

        {/* Published Select */}
        <div className="relative">
          <select 
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" 
            value={filters.published} 
            onChange={(event) => updateFilter('published', event.target.value)}
          >
            <option value="">Any visibility</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>
        </div>
      </div>
    </div>
  )
}
