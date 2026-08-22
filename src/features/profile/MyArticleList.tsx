import { Route as homeRoute } from "@/routes/_app/_protected/profile/$userId/_profile/index";
import { useTranslation } from "react-i18next";
import { getUserArticleList } from "@/services/apiArticle";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/ui/Loading";
import DeleteArticleModal from "../article/DeleteArticleModal";
import { useState } from "react";
import ArticleList from "@/ui/ArticleList";

export default function MyArticleList() {
    const { t } = useTranslation();
    const { userId } = homeRoute.useParams();
    const [deleteArticleId, setDeleteArticleId] = useState<string | null>(null);

    const { data: articleList, isLoading, isError, error } = useQuery({
        queryKey: ['get-my-article-list', userId],
        queryFn: async () => {
            return await getUserArticleList({ isMyArticle: true, userId: userId });
        },
    });

    return (
        <>
            {isLoading && !isError && <Loading />}
            {isError && <main className="flex items-center justify-center min-h-screen">
                <div className="text-3xl text-red-600">
                    {error.message || t('article.list.loadFailed')}
                </div>
            </main>}

            {!isLoading && !isError && articleList &&
                <ArticleList articleList={articleList} setDeleteArticleId={setDeleteArticleId} />
            }
            <DeleteArticleModal
                articleId={deleteArticleId}
                onClose={() => setDeleteArticleId(null)}
            />
        </>
    );
}