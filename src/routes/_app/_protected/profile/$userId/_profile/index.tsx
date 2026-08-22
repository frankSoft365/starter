import MyArticleList from '@/features/profile/MyArticleList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_protected/profile/$userId/_profile/')({
    component: MyArticleList,
})

