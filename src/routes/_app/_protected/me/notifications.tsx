import NotificationsTab from '@/features/notifications/NotificationsTab'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_protected/me/notifications')({
  component: NotificationsTab,
})
