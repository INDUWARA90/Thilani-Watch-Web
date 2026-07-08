import { useCallback, useState } from 'react'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { cloudinaryApi } from '../api/cloudinaryApi'
import { getId, normalizeList } from '../lib/adminUtils'
import { buildWatchPayload, emptyWatchForm, getImageUrl, mergeImageUrls, splitImageUrls, watchFromApi } from './watchFormModel'
import { useProductReferences } from './useProductReferences'
import { useWatchList } from './useWatchList'

const initialFilters = {
  search: '',
  stock: '',
  brand: '',
  category: '',
  featured: '',
  published: '',
}

export const useAdminProducts = () => {
  const [filters, setFilters] = useState(initialFilters)
  const [form, setForm] = useState(emptyWatchForm)
  const [editingWatch, setEditingWatch] = useState(null)
  const [uploadedImages, setUploadedImages] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const setProductError = useCallback((nextError) => setError(nextError), [])
  const { brands, categories } = useProductReferences(setProductError)
  const { isLoading, loadWatches, visibleWatches } = useWatchList(filters, setProductError)

  const resetForm = () => {
    setEditingWatch(null)
    setUploadedImages([])
    setForm(emptyWatchForm)
  }

  const saveWatch = async () => {
    setError('')
    setMessage('')
    setIsSaving(true)

    try {
      const payload = buildWatchPayload(form)
      if (editingWatch) {
        await adminApi.updateWatch(getId(editingWatch), payload)
        setMessage('Watch updated.')
      } else {
        await adminApi.createWatch(payload)
        setMessage('Watch created.')
      }
      resetForm()
      await loadWatches()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to save watch.'))
    } finally {
      setIsSaving(false)
    }
  }

  const editWatch = (watch) => {
    setEditingWatch(watch)
    setUploadedImages([])
    setForm(watchFromApi(watch))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const uploadImages = async (files) => {
    if (files.length === 0) return

    setError('')
    try {
      const payload = await cloudinaryApi.uploadWatchImages(files)
      const uploaded = normalizeList(payload?.images || payload, ['images'])
      const urls = uploaded.map(getImageUrl).filter(Boolean)
      setUploadedImages((current) => [...current, ...uploaded])
      setForm((current) => ({
        ...current,
        images: mergeImageUrls(current.images, urls),
        thumbnail: current.thumbnail || urls[0] || '',
      }))
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Image upload failed.'))
    }
  }

  const deleteUploadedImage = (image) => {
    const url = getImageUrl(image)
    setUploadedImages((current) => current.filter((item) => item !== image))
    setForm((current) => ({
      ...current,
      images: splitImageUrls(current.images)
        .filter((item) => item !== url)
        .join('\n'),
      thumbnail: current.thumbnail === url ? '' : current.thumbnail,
    }))
  }

  const quickStock = async (watch, value) => {
    try {
      await adminApi.updateWatchStock(getId(watch), Number.parseInt(value || '0', 10))
      await loadWatches()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to update stock.'))
    }
  }

  const togglePublish = async (watch) => {
    try {
      await adminApi.updateWatchPublishStatus(getId(watch), !watch.isPublished)
      await loadWatches()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to update publish status.'))
    }
  }

  const deleteWatch = async (watch) => {
    if (!window.confirm(`Delete ${watch.name}?`)) return

    try {
      await adminApi.deleteWatch(getId(watch))
      await loadWatches()
      setMessage('Watch deleted.')
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to delete watch.'))
    }
  }

  return {
    brands,
    categories,
    deleteUploadedImage,
    deleteWatch,
    editWatch,
    editingWatch,
    error,
    filters,
    form,
    isLoading,
    isSaving,
    message,
    quickStock,
    resetForm,
    saveWatch,
    setFilters,
    setForm,
    togglePublish,
    uploadImages,
    uploadedImages,
    visibleWatches,
  }
}
