import HomePage from '@/ui/HomePage'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_home')({
    component: RouteComponent,
})

function RouteComponent() {
    return <HomePage>
        <Outlet />
    </HomePage>
}
