import HomePage from '@/ui/HomePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
    component: HomePage,
})
