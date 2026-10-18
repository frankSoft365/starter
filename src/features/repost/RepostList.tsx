import { Route as repostsRoute } from "@/routes/_app/_protected/profile/$userId/_profile/reposts";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useGetInfiniteRepostList } from "./repost";
import RepostListItem from "./RepostListItem";

export default function RepostList() {
  const { t } = useTranslation();
  const { userId } = repostsRoute.useParams();
  const queryClient = useQueryClient();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useGetInfiniteRepostList(userId);

  // auto fetch list
  const listBottomRef = useRef<HTMLLIElement | null>(null);
  useEffect(() => {
    const ref = listBottomRef.current;
    if (!ref) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="w-full py-4">
      {status === "pending" && (
        <div className="w-full p-6 m-auto flex items-center justify-center gap-2">
          <span className="loading loading-spinner loading-xl"></span>
          <span>{t("common.loading")}</span>
        </div>
      )}
      {status === "error" && (
        <div className="flex flex-col items-center justify-center gap-3 p-6">
          <p className="text-red-500 text-xl">
            {t("common.error")}: {error.message}
          </p>
          <button
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["get-user-repost-list", userId],
              })
            }
            className="btn btn-sm btn-outline"
          >
            {t("common.retry")}
          </button>
        </div>
      )}
      {status === "success" &&
        (data.pages.flatMap((page) => page.items).length > 0 ? (
          <ul className="list bg-base-100">
            {data.pages
              .flatMap((page) => page.items)
              .map((item) => {
                return (
                  <RepostListItem key={item.repost.id} repostListItem={item} />
                );
              })}
            <li
              key={"id-bottom-ref"}
              ref={listBottomRef}
              className="list-row h-4 min-h-4"
              aria-hidden
            ></li>
            {isFetchingNextPage && (
              <li key={"id-loading"} className="list-row">
                {t("common.loadingMore")}
              </li>
            )}
            {!hasNextPage && (
              <li key={"id-no-more"} className="list-row text-center h-24 p-5">
                没有更多了！
              </li>
            )}
          </ul>
        ) : (
          <div className="h-48 text-base-content/65 text-center p-5">
            没有数据了！
          </div>
        ))}
    </div>
  );
}
