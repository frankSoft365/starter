import ArticleListItem from "@/features/home/ArticleListItem";
import type { ArticleListItemVO } from "@/types/article";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Route as articleDetailRoute } from "@/routes/_app/article.$articleId";

export default function ArticleList({
    articleList,
    setDeleteArticleId,
    setEscapeArticleId
}: {
    articleList: ArticleListItemVO[];
    setDeleteArticleId: (id: string | null) => void;
    setEscapeArticleId?: (id: string | null) => void;
}) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <ul className="list w-full lg:w-2xl bg-base-100">
            {articleList.length === 0 && <main className="flex items-center justify-center min-h-screen">
                <div className="text-3xl text-red-600">
                    {t('article.list.empty')}
                </div>
            </main>}
            {articleList.map((article) => {
                return (
                    <div
                        key={article.id}
                        onClick={() => {
                            setEscapeArticleId && setEscapeArticleId(article.id);
                            navigate({ to: articleDetailRoute.to, params: { articleId: article.id } })
                        }}
                    >
                        <ArticleListItem
                            article={article}
                            onDelete={() => setDeleteArticleId(article.id)}
                        />
                    </div>
                );
            })}
        </ul>
    );
}