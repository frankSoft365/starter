import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/search/_search/publications')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/search/_search/publications"!</div>
}
