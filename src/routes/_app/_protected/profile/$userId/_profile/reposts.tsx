import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/_protected/profile/$userId/_profile/reposts',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/_protected/_profile/$emailname/repost"!</div>
}
