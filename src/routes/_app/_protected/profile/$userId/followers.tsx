import FollowListPage from '@/features/profile/FollowListPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/_protected/profile/$userId/followers',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams()

  return <FollowListPage userId={userId} type="followers" />
}
