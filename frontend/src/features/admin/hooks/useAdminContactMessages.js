import { useCallback, useEffect, useMemo, useState } from 'react'
import { getApiErrorMessage } from '@/shared/api/apiClient'
import { adminApi } from '@/features/admin/api/adminApi'
import { getId, normalizeList, readBoolean } from '@/features/admin/lib/adminUtils'

export const useAdminContactMessages = () => {
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ read: '', search: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [pendingId, setPendingId] = useState('')
  const [selectedMessage, setSelectedMessage] = useState(null)

  const apiFilters = useMemo(
    () => ({
      read: filters.read,
      search: filters.search.trim(),
    }),
    [filters],
  )

  const loadMessages = useCallback(async () => {
    setError('')
    setIsLoading(true)
    try {
      const payload = await adminApi.getContactMessages(apiFilters)
      const nextMessages = normalizeList(payload, ['messages', 'contacts', 'contactMessages'])
      setMessages(nextMessages)
      setSelectedMessage((current) => {
        if (!current) return nextMessages[0] || null
        return nextMessages.find((item) => getId(item) === getId(current)) || nextMessages[0] || null
      })
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load contact messages.'))
    } finally {
      setIsLoading(false)
    }
  }, [apiFilters])

  useEffect(() => {
    const timer = setTimeout(loadMessages, 0)
    return () => clearTimeout(timer)
  }, [loadMessages])

  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  const openMessage = async (contactMessage) => {
    const messageId = getId(contactMessage)
    setError('')
    setPendingId(messageId)
    try {
      const payload = await adminApi.getContactMessage(messageId)
      const detail = payload?.message || payload?.contact || payload
      setSelectedMessage(detail)
      if (!readBoolean(detail?.isRead)) {
        await adminApi.updateContactReadStatus(messageId, true)
        await loadMessages()
      }
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to open contact message.'))
    } finally {
      setPendingId('')
    }
  }

  const toggleReadStatus = async (contactMessage) => {
    const messageId = getId(contactMessage)
    const nextReadStatus = !readBoolean(contactMessage?.isRead)
    setError('')
    setMessage('')
    setPendingId(messageId)
    try {
      await adminApi.updateContactReadStatus(messageId, nextReadStatus)
      setMessage(nextReadStatus ? 'Message marked as read.' : 'Message marked as unread.')
      await loadMessages()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to update message status.'))
    } finally {
      setPendingId('')
    }
  }

  const deleteMessage = async (contactMessage) => {
    const messageId = getId(contactMessage)
    setError('')
    setMessage('')
    setPendingId(messageId)
    try {
      await adminApi.deleteContactMessage(messageId)
      setMessage('Contact message deleted.')
      setSelectedMessage((current) => (getId(current) === messageId ? null : current))
      await loadMessages()
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to delete contact message.'))
    } finally {
      setPendingId('')
    }
  }

  return {
    deleteMessage,
    error,
    filters,
    isLoading,
    message,
    messages,
    openMessage,
    pendingId,
    selectedMessage,
    toggleReadStatus,
    updateFilter,
  }
}
