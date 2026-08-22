import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/_protected/profile/$userId/_profile/activity',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>"/_app/_protected/_profile/$emailname/activity"!</div>
}
