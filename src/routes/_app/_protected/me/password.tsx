import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_protected/me/password')({
    component: RouteComponent,
})

function RouteComponent() {

    return (
        <div>Hello "/me/password"!</div>
    );

}
