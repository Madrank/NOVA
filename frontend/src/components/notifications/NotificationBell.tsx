import { AnimatePresence, motion } from 'motion/react'
import { Bell, Check, CheckCheck } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import { cn } from '@/lib/cn'
import { notificationsApi } from '@/services/notifications'
import type { PublicNotification } from '@/types/notification'

const POLL_INTERVAL_MS = 30_000

function timeAgo(iso: string): string {
  const deltaSeconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (deltaSeconds < 60) return "à l'instant"
  const minutes = Math.round(deltaSeconds / 60)
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.round(hours / 24)
  if (days < 7) return `il y a ${days} j`
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date(iso))
}

interface NotificationBellProps {
  solid: boolean
  onNavigate?: () => void
}

export function NotificationBell({ solid, onNavigate }: NotificationBellProps) {
  const { status } = useAuth()
  const navigate = useNavigate()
  const authenticated = status === 'authenticated'
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<PublicNotification[]>([])
  const [unread, setUnread] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  const refresh = useCallback(async () => {
    try {
      const data = await notificationsApi.list()
      setItems(data.notifications)
      setUnread(data.unreadCount)
    } catch {
      // silencieux : la cloche reste simplement vide
    }
  }, [])

  const refreshCount = useCallback(async () => {
    try {
      const data = await notificationsApi.unreadCount()
      setUnread(data.unreadCount)
    } catch {
      // silencieux
    }
  }, [])

  useEffect(() => {
    if (!authenticated) return
    const initial = setTimeout(() => void refreshCount(), 0)
    const timer = setInterval(() => void refreshCount(), POLL_INTERVAL_MS)
    const onFocus = () => void refreshCount()
    window.addEventListener('focus', onFocus)
    return () => {
      clearTimeout(initial)
      clearInterval(timer)
      window.removeEventListener('focus', onFocus)
    }
  }, [authenticated, refreshCount])

  useEffect(() => {
    if (!open) return
    const onClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = async () => {
    if (open) {
      setOpen(false)
      return
    }
    setOpen(true)
    void refresh()
  }

  const openNotification = (notification: PublicNotification) => {
    if (!notification.readAt) {
      setItems((previous) => previous.map((item) => (item.id === notification.id ? { ...item, readAt: new Date().toISOString() } : item)))
      setUnread((count) => Math.max(0, count - 1))
      void notificationsApi.markRead(notification.id)
    }
    setOpen(false)
    if (notification.link) {
      navigate(notification.link)
      onNavigate?.()
    }
  }

  const markAll = async () => {
    try {
      await notificationsApi.markAllRead()
    } catch {
      // silencieux
    }
    setUnread(0)
    setItems((previous) => previous.map((item) => ({ ...item, readAt: item.readAt ?? new Date().toISOString() })))
  }

  if (!authenticated) return null

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => void toggle()}
        aria-label={unread > 0 ? `Notifications (${unread} non lues)` : 'Notifications'}
        aria-expanded={open}
        className={cn(
          'relative inline-flex rounded-btn p-2 transition-colors duration-300',
          solid ? 'text-ink/80 hover:text-gold' : 'text-ivory/85 hover:text-gold-light',
        )}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unread > 0 ? (
          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-bordeaux px-1 text-[0.625rem] font-semibold leading-none text-ivory">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            role="menu"
            aria-label="Notifications"
            className="absolute right-0 top-11 z-50 w-[22rem] max-w-[85vw] overflow-hidden rounded-card border border-noir/10 bg-ivory shadow-[0_24px_60px_-24px_rgba(18,16,14,0.5)]"
          >
            <div className="flex items-center justify-between border-b border-noir/10 px-5 py-4">
              <p className="font-serif text-lg text-noir">Notifications</p>
              {unread > 0 ? (
                <button
                  type="button"
                  onClick={() => void markAll()}
                  className="inline-flex items-center gap-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-gold transition-colors hover:text-noir"
                >
                  <CheckCheck className="h-4 w-4" aria-hidden="true" />
                  Tout marquer lu
                </button>
              ) : null}
            </div>

            <ul className="max-h-[22rem] overflow-y-auto">
              {items.length === 0 ? (
                <li className="px-5 py-10 text-center text-sm text-ink/50">
                  Aucune notification pour le moment.
                </li>
              ) : (
                items.map((notification) => (
                  <li key={notification.id}>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => openNotification(notification)}
                      className={cn(
                        'w-full px-5 py-4 text-left transition-colors duration-200 hover:bg-ivory-deep/60',
                        !notification.readAt && 'bg-gold/[0.06]',
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className={cn('text-sm leading-snug text-noir', !notification.readAt && 'font-medium')}>
                          {notification.title}
                        </p>
                        {!notification.readAt ? (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-ink/60">{notification.body}</p>
                      <p className="mt-2 text-[0.625rem] uppercase tracking-[0.14em] text-ink/40">
                        {timeAgo(notification.createdAt)}
                      </p>
                    </button>
                  </li>
                ))
              )}
            </ul>

            {items.length > 0 ? (
              <div className="border-t border-noir/10 px-5 py-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ink/60 transition-colors hover:text-gold"
                >
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Fermer
                </button>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}