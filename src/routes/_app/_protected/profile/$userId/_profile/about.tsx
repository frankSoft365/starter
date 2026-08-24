import About from '@/features/profile/About'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/_protected/profile/$userId/_profile/about',
)({
  component: About,
})
