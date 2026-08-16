import CollectionListDetail from '@/features/profile/CollectionListDetail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_protected/profile/lists/$listId')({
    component: CollectionListDetail,
})
