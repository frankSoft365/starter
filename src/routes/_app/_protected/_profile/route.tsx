import ProfileTab from '@/features/profile/ProfileTab'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_protected/_profile')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <ProfileTab>
            <Outlet />
        </ProfileTab>
    );
}
