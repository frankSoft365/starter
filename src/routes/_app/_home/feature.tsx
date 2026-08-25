import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_home/feature')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Feature</div>
}
