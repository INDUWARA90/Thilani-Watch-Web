import { getId, getTitle } from '../lib/adminUtils'

export const WatchFilters = ({ brands, categories, filters, setFilters }) => {
  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <input
        className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15"
        placeholder="Search watches"
        value={filters.search}
        onChange={(event) => updateFilter('search', event.target.value)}
      />
      <select className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" value={filters.stock} onChange={(event) => updateFilter('stock', event.target.value)}>
        <option value="">Any stock</option>
        <option value="true">In stock</option>
        <option value="false">Out of stock</option>
      </select>
      <select className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" value={filters.brand} onChange={(event) => updateFilter('brand', event.target.value)}>
        <option value="">Any brand</option>
        {brands.map((brand) => (
          <option key={getId(brand)} value={getTitle(brand)}>
            {getTitle(brand)}
          </option>
        ))}
      </select>
      <select className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
        <option value="">Any category</option>
        {categories.map((category) => (
          <option key={getId(category)} value={getId(category)}>
            {getTitle(category)}
          </option>
        ))}
      </select>
      <select className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" value={filters.featured} onChange={(event) => updateFilter('featured', event.target.value)}>
        <option value="">Any featured</option>
        <option value="true">Featured</option>
        <option value="false">Not featured</option>
      </select>
      <select className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15" value={filters.published} onChange={(event) => updateFilter('published', event.target.value)}>
        <option value="">Any published</option>
        <option value="true">Published</option>
        <option value="false">Unpublished</option>
      </select>
    </div>
  )
}
