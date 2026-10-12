import { Route as homeRoute } from "@/routes/_app/_protected/profile/$userId/_profile/index";
import { useTranslation } from "react-i18next";
import { getUserArticleList } from "@/services/apiArticle";
import { useInfiniteQuery } from "@tanstack/react-query";
import ArticleListItem from "../home/ArticleListItem";
import type { CursorPageRequest } from "@/types/comment";
import type { UserArticleListRequest } from "@/types/article";
import { useEffect, useRef } from "react";
import ArticleListSkeleton from "@/ui/article/ArticleListSkeleton";
import { useBatchArticleResults } from "../article/useBatchArticleResults";

export default function MyArticleList() {
  const { t } = useTranslation();
  const { userId } = homeRoute.useParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["get-profile-my-article-list", userId],
    queryFn: async ({ pageParam }: { pageParam: CursorPageRequest }) => {
      const params: UserArticleListRequest = {
        ...pageParam,
        userId,
      };
      return await getUserArticleList({ params });
    },
    initialPageParam: {
      lastCreatedAt: null,
      lastId: null,
    } as CursorPageRequest,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore
        ? {
            lastCreatedAt: lastPage.nextCursorCreatedAt,
            lastId: lastPage.nextCursorId,
          }
        : undefined;
    },
  });

  const articleIdBatches =
    data?.pages
      .map((page) => [...new Set(page.items.map((article) => article.id))])
      .filter((articleIds) => articleIds.length > 0) ?? [];
  const { articleResultsById, articleResultStatusById } =
    useBatchArticleResults(articleIdBatches);

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
              .map((articleListItemVO) => {
                const articleResult = articleResultsById.get(
                  articleListItemVO.id,
                );
                return (
                  <ArticleListItem
                    key={articleListItemVO.id}
                    article={{
                      ...articleListItemVO,
                      repostCount:
                        articleResult?.repostCount ??
                        articleListItemVO.repostCount,
                      isCollected:
                        articleResult?.viewerEdge?.collectionsConnection
                          .hasCollected ?? articleListItemVO.isCollected,
                    }}
                    articleResultStatus={
                      articleResultStatusById.get(articleListItemVO.id) ??
                      "pending"
                    }
                  />
                );
              })}
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
