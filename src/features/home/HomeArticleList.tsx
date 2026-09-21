import { useQuery } from "@tanstack/react-query";
import { getArticleList } from "@/services/apiArticle";
import { useAtom } from "jotai";
import { escapeArticleIdAtom } from "@/atoms/article";
import { useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import DeleteArticleModal from "../article/DeleteArticleModal";
import { useState } from "react";
import ArticleList from "@/ui/ArticleList";
import ArticleListItemSkeleton from "./ArticleListItemSkeleton";

export default function HomeArticleList() {
  const { t } = useTranslation();
  const [deleteArticleId, setDeleteArticleId] = useState<string | null>(null);
  const [escapeArticleId, setEscapeArticleId] = useAtom(escapeArticleIdAtom);

  const {
    data: articleList,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["get-home-article-list"],
    queryFn: async () => {
      return await getArticleList({ isMyArticle: false });
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
      const el = document.getElementById(
        `article-list-item-${escapeArticleId}`,
      );

      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "center" });
      }
    }, 0);
    setEscapeArticleId(null);
    hasJumpRef.current = true;
  }, [articleList]);

  return (
    <>
      {/* loading skeleton */}
      {isLoading &&
        !isError &&
        Array.from({ length: 6 }, (_, index) => (
          <ArticleListItemSkeleton key={index} />
        ))}
      {isError && (
        <main className="flex items-center justify-center min-h-screen">
          <div className="text-3xl text-red-600">
            {error.message || t("article.list.loadFailed")}
          </div>
        </main>
      )}

      {!isLoading && !isError && articleList && (
        <ArticleList
          articleList={articleList}
          setDeleteArticleId={setDeleteArticleId}
          setEscapeArticleId={setEscapeArticleId}
        />
      )}
      <DeleteArticleModal
        articleId={deleteArticleId}
        onClose={() => setDeleteArticleId(null)}
      />
    </>
  );
}
