import { createFileRoute, Outlet } from '@tanstack/react-router'
import RequireLogin from '../../../ui/RequireLogin';

export const Route = createFileRoute('/_app/_protected')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <RequireLogin>
            <Outlet />
        </RequireLogin>
    );
}
