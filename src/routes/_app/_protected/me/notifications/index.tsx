import NotificationList from '@/features/notifications/NotificationList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_protected/me/notifications/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <NotificationList type="reply" />
}
