import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '@/features/admin/api/adminApi'
import { getId, normalizeList, readBoolean } from '@/features/admin/lib/adminUtils'

export const useAdminContactMessages = () => {
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ read: '', search: '' })
  const [message, setMessage] = useState('')
  const [pendingId, setPendingId] = useState('')
  const [selectedMessageDetail, setSelectedMessageDetail] = useState(null)
  const queryClient = useQueryClient()

  const apiFilters = useMemo(
    () => ({
      read: filters.read,
      search: filters.search.trim(),
    }),
    [filters],
  )

  const messagesQuery = useQuery({
    queryKey: ['admin', 'contactMessages', apiFilters],
    queryFn: () => adminApi.getContactMessages(apiFilters),
    select: (payload) => normalizeList(payload, ['messages', 'contacts', 'contactMessages']),
  })
  const messages = messagesQuery.data ?? []
  const selectedMessage = selectedMessageDetail && messages.some((item) => getId(item) === getId(selectedMessageDetail))
    ? selectedMessageDetail
    : messages[0] || null

  const invalidateMessages = () => queryClient.invalidateQueries({ queryKey: ['admin', 'contactMessages'] })
  const readStatusMutation = useMutation({
    mutationFn: ({ messageId, nextReadStatus }) => adminApi.updateContactReadStatus(messageId, nextReadStatus),
    onSuccess: async (_data, { nextReadStatus, showMessage }) => {
      if (showMessage) setMessage(nextReadStatus ? 'Message marked as read.' : 'Message marked as unread.')
      await invalidateMessages()
    },
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, 'Unable to update message status.'))
    },
    onSettled: () => setPendingId(''),
  })
  const deleteMutation = useMutation({
    mutationFn: (messageId) => adminApi.deleteContactMessage(messageId),
    onSuccess: async (_data, messageId) => {
      setMessage('Contact message deleted.')
      setSelectedMessageDetail((current) => (getId(current) === messageId ? null : current))
      await invalidateMessages()
    },
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, 'Unable to delete contact message.'))
    },
    onSettled: () => setPendingId(''),
  })
  const messageDetailMutation = useMutation({
    mutationFn: async (contactMessage) => {
      const messageId = getId(contactMessage)
      const payload = await adminApi.getContactMessage(messageId)
      return {
        detail: payload?.message || payload?.contact || payload,
        messageId,
      }
    },
    onSuccess: async ({ detail, messageId }) => {
      setSelectedMessageDetail(detail)
      if (!readBoolean(detail?.isRead)) {
        await readStatusMutation.mutateAsync({ messageId, nextReadStatus: true, showMessage: false })
      }
    },
    onError: (apiError) => {
      setError(getApiErrorMessage(apiError, 'Unable to open contact message.'))
    },
    onSettled: () => setPendingId(''),
  })

  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  const openMessage = async (contactMessage) => {
    const messageId = getId(contactMessage)
    setError('')
    setPendingId(messageId)
    await messageDetailMutation.mutateAsync(contactMessage)
  }

  const toggleReadStatus = async (contactMessage) => {
    const messageId = getId(contactMessage)
    const nextReadStatus = !readBoolean(contactMessage?.isRead)
    setError('')
    setMessage('')
    setPendingId(messageId)
    await readStatusMutation.mutateAsync({ messageId, nextReadStatus, showMessage: true })
  }

  const deleteMessage = async (contactMessage) => {
    const messageId = getId(contactMessage)
    setError('')
    setMessage('')
    setPendingId(messageId)
    await deleteMutation.mutateAsync(messageId)
  }

  const loadError = messagesQuery.error ? getApiErrorMessage(messagesQuery.error, 'Unable to load contact messages.') : ''

  return {
    deleteMessage,
    error: error || loadError,
    filters,
    isLoading: messagesQuery.isLoading,
    message,
    messages,
    openMessage,
    pendingId,
    selectedMessage,
    toggleReadStatus,
    updateFilter,
  }
}
