import { useEffect, useState } from 'react'
import { getApiErrorMessage } from '../../../lib/apiClient'
import { getId, normalizeList } from '../adminUtils'
import { CatalogForm } from './CatalogForm'
import { CatalogHeader } from './CatalogHeader'
import { CatalogTable } from './CatalogTable'
import { buildCatalogPayload, emptyCatalogForm } from './catalogConfig'

export const CatalogManager = ({ api, label, plural }) => {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyCatalogForm)
  const [editingItem, setEditingItem] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadItems = async () => {
    setIsLoading(true)
    setError('')
    try {
      const payload = await api.list()
      setItems(normalizeList(payload, [plural.toLowerCase()]))
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, `Unable to load ${plural.toLowerCase()}.`))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        const payload = await api.list()
        if (isMounted) {
          setItems(normalizeList(payload, [plural.toLowerCase()]))
          setError('')
        }
      } catch (apiError) {
        if (isMounted) {
          setError(getApiErrorMessage(apiError, `Unable to load ${plural.toLowerCase()}.`))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [api, plural])

  const resetForm = () => {
    setEditingItem(null)
    setForm(emptyCatalogForm)
  }

  const updateForm = (event) => {
    const { checked, name, type, value } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const editItem = (item) => {
    setEditingItem(item)
    setForm({
      ...emptyCatalogForm,
      ...item,
      sortOrder: String(item.sortOrder ?? 0),
      isActive: item.isActive !== false,
    })
  }

  const submitItem = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      const payload = buildCatalogPayload(form)
      if (editingItem) {
        await api.update(getId(editingItem), payload)
        setMessage(`${label} updated.`)
      } else {
        await api.create(payload)
        setMessage(`${label} created.`)
      }
      resetForm()
      await loadItems()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, `Unable to save ${label.toLowerCase()}.`))
    }
  }

  const deleteItem = async (item) => {
    if (!window.confirm(`Delete ${item.name}?`)) return

    try {
      await api.remove(getId(item))
      setMessage(`${label} deleted.`)
      await loadItems()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, `Unable to delete ${label.toLowerCase()}.`))
    }
  }

  return (
    <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5">
      <CatalogHeader editingItem={editingItem} label={label} onReset={resetForm} plural={plural} />
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 font-bold text-red-800">{error}</div>}
      {message && <div className="rounded-lg border border-green-200 bg-green-50 px-3.5 py-3 font-bold text-green-800">{message}</div>}
      <CatalogForm editingItem={editingItem} form={form} label={label} setForm={setForm} submitItem={submitItem} updateForm={updateForm} />
      <CatalogTable deleteItem={deleteItem} editItem={editItem} isLoading={isLoading} items={items} plural={plural} />
    </section>
  )
}
