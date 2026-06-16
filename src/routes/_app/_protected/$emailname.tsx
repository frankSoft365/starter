import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_protected/$emailname')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div>Hello "/$emailname"!</div>
    );
}
