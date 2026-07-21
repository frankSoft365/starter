import ProfileTab from '@/features/profile/ProfileTab'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_protected/$emailname')({
    component: ProfileTab,
})
