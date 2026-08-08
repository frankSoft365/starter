import NotificationsTab from '@/features/notifications/NotificationsTab'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_protected/me/notifications')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <NotificationsTab>
            <Outlet />
        </NotificationsTab>
    );
}
