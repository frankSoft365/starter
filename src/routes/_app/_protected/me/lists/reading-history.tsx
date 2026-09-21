import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/_protected/me/lists/reading-history',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/_protected/me/lists/reading-history"!</div>
}
