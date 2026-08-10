import ArticleListItem from "./ArticleListItem";
import { useQuery } from "@tanstack/react-query";
import { getArticleList, getUserArticleList } from "@/services/apiArticle";
import Loading from "@/ui/Loading";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/_app/article.$articleId";
import type { ArticleListRequest } from "@/types/article";
import { useAtom } from "jotai";
import { escapeArticleIdAtom } from "@/atoms/article";
import { useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import DeleteArticleModal from "../article/DeleteArticleModal";
import { useState } from "react";

export default function ArticleList({
    author = 'allUser'
}: {
    author?: 'allUser' | 'myArticle'
}) {
    const navigate = useNavigate();
    const [deleteArticleId, setDeleteArticleId] = useState<string | null>(null);
    const [escapeArticleId, setEscapeArticleId] = useAtom(escapeArticleIdAtom);
    const { t } = useTranslation();
    const params: ArticleListRequest = author === 'allUser' ? { isMyArticle: false } : author === 'myArticle' ? { isMyArticle: true } : {}

    const { data: articleList, isLoading, isError, error } = useQuery({
        queryKey: ['get-article-list'],
        queryFn: async () => {
            if (author === 'allUser') {
                return await getArticleList(params);
            } else {
                return await getUserArticleList(params);
            }
        },
    });

    const hasJumpRef = useRef(false);

    useLayoutEffect(() => {
        if (hasJumpRef.current) {
            return;
        }
        if (!articleList || !escapeArticleId) {
            return;
        }
        setTimeout(() => {
            const el = document.getElementById(`article-list-item-${escapeArticleId}`);

            if (el) {
                el.scrollIntoView({ behavior: "auto", block: "center" });
            }
        }, 0);
        setEscapeArticleId(null);
        hasJumpRef.current = true;
    }, [articleList]);

    return (
        <>
            {isLoading && !isError && <Loading />}
            {isError && <main className="flex items-center justify-center min-h-screen">
                <div className="text-3xl text-red-600">
                    {error.message || t('article.list.loadFailed')}
                </div>
            </main>}

            {!isLoading && !isError && articleList && <>
                <ul className="list w-full lg:w-3xl bg-base-100 shadow-md">
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
                                    setEscapeArticleId(article.id);
                                    navigate({ to: Route.to, params: { articleId: article.id } })
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
            </>}
            <DeleteArticleModal
                articleId={deleteArticleId}
                onClose={() => setDeleteArticleId(null)}
            />
        </>
    );
}