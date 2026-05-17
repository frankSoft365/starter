import { createFileRoute } from '@tanstack/react-router'
import RootLayout from '../components/RootLayout'
import ArticleList from '../components/ArticleList'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <RootLayout>
            <ArticleList />
        </RootLayout>
    )
}