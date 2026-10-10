import { useInfiniteQuery } from "@tanstack/react-query";
import { getPublicHomeArticleList } from "@/services/apiArticle";
import { useTranslation } from "react-i18next";
import ArticleListSkeleton from "../../ui/article/ArticleListSkeleton";
import type { HomeArticleListRequest } from "@/types/article";
import { useEffect, useRef } from "react";
import ArticleListItem from "./ArticleListItem";

export default function ForYouArticleList() {
  const { t } = useTranslation();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["get-public-home-article-list"],
    queryFn: async ({ pageParam }: { pageParam: HomeArticleListRequest }) => {
      return await getPublicHomeArticleList({ params: pageParam });
    },
    initialPageParam: {
      lastCreatedAt: null,
      lastId: null,
    } as HomeArticleListRequest,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore
        ? {
            lastCreatedAt: lastPage.nextCursorCreatedAt,
            lastId: lastPage.nextCursorId,
          }
        : undefined;
    },
  });
  // infinite scrolling list
  const listBottomRef = useRef<HTMLLIElement | null>(null);
  useEffect(() => {
    const ref = listBottomRef.current;
    if (!ref) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [hasNextPage, isFetching, fetchNextPage]);

  return (
    <div className="w-full">
      {status === "pending" && <ArticleListSkeleton />}
      {status === "error" && (
        <main className="flex items-center justify-center min-h-screen">
          <div className="text-3xl text-red-600">
            {error.message || t("article.list.loadFailed")}
          </div>
        </main>
      )}
      {status === "success" &&
        (data.pages.flatMap((page) => page.items).length > 0 ? (
          <ul className="list bg-base-100">
            {data.pages
              .flatMap((page) => page.items)
              .map((articleListItemVO, index) => (
                <ArticleListItem
                  index={index}
                  key={articleListItemVO.id}
                  article={articleListItemVO}
                />
              ))}
            <li ref={listBottomRef} className="list-row h-0.5" aria-hidden></li>
            {isFetchingNextPage && (
              <li className="list-row">{t("common.loadingMore")}</li>
            )}
            {!hasNextPage && (
              <li className="list-row text-center h-24 p-5">没有更多了！</li>
            )}
          </ul>
        ) : (
          <div className="h-48 text-base-content/60 text-center p-5">
            没有更多了！
          </div>
        ))}
    </div>
  );
}
