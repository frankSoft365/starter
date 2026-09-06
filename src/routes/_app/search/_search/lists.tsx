import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/search/_search/lists')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/search/_search/lists"!</div>
}
