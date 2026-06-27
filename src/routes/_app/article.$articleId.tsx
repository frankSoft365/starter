import ArticleDetail from '@/components/ArticleDetail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/article/$articleId')({
    component: ArticleDetail,
})

