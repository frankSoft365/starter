import HomeArticleList from '@/features/home/HomeArticleList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_home/')({
    component: HomeArticleList,
})
