import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/search/_search/users')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/search/user"!</div>
}
