import { Route as activityRoute } from "@/routes/_app/_protected/profile/$userId/_profile/activity";
import { useGetInfiniteActivityList } from "./activity";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ActivityListItem from "./ActivityListItem";
import { useBatchArticleResults } from "../article/useBatchArticleResults";
import type { UserActivity } from "@/types/activity";
import { useUserProfileContainer } from "../profile/profile";

type ActivityQueryType = "all" | "claps" | "responses";

export default function ActivityList() {
  const { t } = useTranslation();
  const { userId } = activityRoute.useParams();
  const { data: userInfo, status: userProfileStatus } =
    useUserProfileContainer(userId);

  const [activityQueryType, setActivityQueryType] =
    useState<ActivityQueryType>("all");

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useGetInfiniteActivityList(userId, activityQueryType);

  const articleIds =
    data?.pages.map((page) => [
      ...new Set(
        page.items.flatMap((userActivity) =>
          userActivity.activityType === "POST_CLAPPED" && userActivity.post.id
            ? [userActivity.post.id]
            : [],
        ),
      ),
    ]) ?? [];

  const { articleResultsById, articleResultStatusById } =
    useBatchArticleResults(articleIds);

  // auto fetch comment list
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
      {/* select */}
      <select
        defaultValue="all"
        onChange={(e) =>
          setActivityQueryType(e.target.value as ActivityQueryType)
        }
        className="select mb-4 w-28 rounded-full"
      >
        <option value={"all"}>{t("activity.filter.all")}</option>
        <option value={"claps"}>{t("activity.filter.claps")}</option>
        <option value={"responses"}>{t("activity.filter.responses")}</option>
      </select>
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
        </div>
      )}
      {status === "success" &&
        userProfileStatus === "success" &&
        (data.pages.flatMap((page) => page.items).length > 0 ? (
          <ul className="list bg-base-100">
            {data.pages
              .flatMap((page) => page.items)
              .map((userActivity) => {
                const postClappedTypeUserActivity: UserActivity = {
                  ...userActivity,
                  post: {
                    ...userActivity.post,
                    repostCount:
                      articleResultsById.get(userActivity.post.id)
                        ?.repostCount ?? 0,
                    isCollected:
                      articleResultsById.get(userActivity.post.id)?.viewerEdge
                        ?.collectionsConnection.hasCollected ?? false,
                  },
                };
                return (
                  <ActivityListItem
                    profileUser={userInfo}
                    userActivity={
                      userActivity.activityType === "POST_CLAPPED"
                        ? postClappedTypeUserActivity
                        : userActivity
                    }
                    articleResultStatus={
                      userActivity.activityType === "POST_CLAPPED"
                        ? articleResultStatusById.get(userActivity.post.id)
                        : undefined
                    }
                    key={userActivity.activityId}
                  />
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
