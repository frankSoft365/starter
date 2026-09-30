import { useEffect, useRef } from "react";
import { useGetInfiniteReadingHistoryList } from "./readingHistory";
import { useTranslation } from "react-i18next";
import ArticleListItem from "../home/ArticleListItem";
import ArticleListSkeleton from "../home/ArticleListItemSkeleton";
import { CLEAR_READING_HISTORY_MODAL_ID } from "@/constants/modal";

export default function ReadingHistoryList() {
  const { t } = useTranslation();
  const { query, retry } = useGetInfiniteReadingHistoryList();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = query;
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

  // handle click clear-history button
  function clickClearReadingHistory() {
    (
      document.getElementById(
        CLEAR_READING_HISTORY_MODAL_ID,
      ) as HTMLDialogElement
    )?.showModal();
  }

  return (
    <>
      {/* the clear-history button */}
      {status === "success" &&
        data.pages.flatMap((page) => page.items).length > 0 && (
          <div className="w-full bg-base-200 flex items-center justify-between py-6 px-5 my-6">
            <p className="text-xs md:text-sm">
              You can clear your reading history for a fresh start.
            </p>
            <button
              onClick={clickClearReadingHistory}
              className="btn btn-xs md:btn-sm btn-error rounded-full text-base-300"
            >
              Clear history
            </button>
          </div>
        )}
      {/* reading history article list */}
      <div className="w-full">
        {status === "pending" && <ArticleListSkeleton />}
        {status === "error" && (
          <div className="flex flex-col items-center justify-center gap-3 p-6">
            <p className="text-red-500 text-xl">
              {t("common.error")}: {error.message}
            </p>
            <button onClick={retry} className="btn btn-sm btn-outline">
              {t("common.retry")}
            </button>
          </div>
        )}
        {status === "success" &&
          (data.pages.flatMap((page) => page.items).length > 0 ? (
            <ul className="list bg-base-100">
              {/* normal comment list */}
              {data.pages
                .flatMap((page) => page.items)
                .map((articleListItemVO) => (
                  <ArticleListItem
                    key={articleListItemVO.id}
                    article={articleListItemVO}
                  />
                ))}
              <li
                ref={listBottomRef}
                className="list-row h-0.5"
                aria-hidden
              ></li>
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
    </>
  );
}
