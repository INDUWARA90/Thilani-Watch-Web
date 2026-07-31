import { useCallback, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '../api/adminApi'
import { cloudinaryApi } from '@/shared/api/cloudinaryApi'
import { getId, normalizeList } from '../lib/adminUtils'
import { buildWatchPayload, emptyWatchForm, getImageUrl, mergeImageUrls, splitImageUrls, watchFromApi } from './watchFormModel'
import { useProductReferences } from './useProductReferences'
import { useWatchList } from './useWatchList'

const initialFilters = {
  search: '',
  stock: '',
  brand: '',
  category: '',
  gender: '',
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
  const queryClient = useQueryClient()
  const setProductError = useCallback((nextError) => setError(nextError), [])
  const { brands, categories } = useProductReferences(setProductError)
  const { isLoading, visibleWatches } = useWatchList(filters, setProductError)
  const invalidateWatches = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin', 'watches'] })
  }
  const saveWatchMutation = useMutation({
    mutationFn: ({ id, payload }) => (id ? adminApi.updateWatch(id, payload) : adminApi.createWatch(payload)),
    onSuccess: async (_data, { id }) => {
      setMessage(id ? 'Watch updated.' : 'Watch created.')
      resetForm()
      await invalidateWatches()
    },
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, 'Unable to save watch.'))
    },
  })
  const stockMutation = useMutation({
    mutationFn: ({ id, value }) => adminApi.updateWatchStock(id, Number.parseInt(value || '0', 10)),
    onSuccess: invalidateWatches,
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, 'Unable to update stock.'))
    },
  })
  const publishMutation = useMutation({
    mutationFn: ({ id, isPublished }) => adminApi.updateWatchPublishStatus(id, isPublished),
    onSuccess: invalidateWatches,
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, 'Unable to update publish status.'))
    },
  })
  const deleteMutation = useMutation({
    mutationFn: (watch) => adminApi.deleteWatch(getId(watch)),
    onSuccess: async () => {
      await invalidateWatches()
      setMessage('Watch deleted.')
    },
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, 'Unable to delete watch.'))
    },
  })

  const clearProductFeedback = () => {
    setError('')
    setMessage('')
  }

  const resetForm = () => {
    setEditingWatch(null)
    setUploadedImages([])
    setForm(emptyWatchForm)
  }

  const saveWatch = async () => {
    setError('')
    setMessage('')
    try {
      await saveWatchMutation.mutateAsync({ id: getId(editingWatch), payload: buildWatchPayload(form) })
      return true
    } catch {
      return false
    }
  }

  const editWatch = (watch) => {
    setEditingWatch(watch)
    setUploadedImages([])
    setForm(watchFromApi(watch))
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
    await stockMutation.mutateAsync({ id: getId(watch), value })
  }

  const togglePublish = async (watch) => {
    await publishMutation.mutateAsync({ id: getId(watch), isPublished: !watch.isPublished })
  }

  const deleteWatch = async (watch) => {
    if (!window.confirm(`Delete ${watch.name}?`)) return

    await deleteMutation.mutateAsync(watch)
  }

  return {
    brands,
    categories,
    deleteUploadedImage,
    deleteWatch,
    editWatch,
    editingWatch,
    error,
    clearProductFeedback,
    filters,
    form,
    isLoading,
    isSaving: saveWatchMutation.isPending,
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
