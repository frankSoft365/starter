import Lists from '@/features/profile/Lists'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/_protected/profile/$userId/_profile/lists',
)({
  component: Lists,
})
