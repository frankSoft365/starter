import { createFileRoute } from '@tanstack/react-router'
import HomeArticleList from '@/features/home/HomeArticleList'

export const Route = createFileRoute('/_app/')({
    component: HomeArticleList,
})
