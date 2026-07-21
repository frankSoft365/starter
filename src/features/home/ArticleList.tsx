import ArticleListItem from "./ArticleListItem";
import { useQuery } from "@tanstack/react-query";
import { getArticleList } from "@/services/apiArticle";
import Loading from "@/ui/Loading";
import { Link } from "@tanstack/react-router";
import { Route } from "@/routes/_app/article.$articleId";
import type { ArticleListRequest } from "@/types/article";

export default function ArticleList({
    author = 'allUser'
}: {
    author?: 'allUser' | 'myArticle' | 'oneUser'
}) {
    const params: ArticleListRequest = author === 'allUser' ? {} : author === 'myArticle' ? { isMyArticle: true } : {}

    const { data: articleList, isLoading, isError, error } = useQuery({
        queryKey: ['get-article-list'],
        queryFn: async () => {
            return await getArticleList(params);
        },
    });
    return (
        <>
            {isLoading && !isError && <Loading />}
            {isError && <main className="flex items-center justify-center min-h-screen">
                <div className="text-3xl text-red-600">
                    {error.message || 'Failed to load article list.'}
                </div>
            </main>}

            {!isLoading && !isError && articleList && <ul className="list w-full lg:w-3xl bg-base-100 shadow-md">
                {articleList.length === 0 && <main className="flex items-center justify-center min-h-screen">
                    <div className="text-3xl text-red-600">
                        Article not found.
                    </div>
                </main>}
                {articleList.map((article) => {
                    return (
                        <Link key={article.id} to={Route.to} params={{ articleId: article.id }}>
                            <ArticleListItem
                                article={article}
                            />
                        </Link>
                    );
                })}
            </ul>}
        </>
    );
}