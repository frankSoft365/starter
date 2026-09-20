import { getUserActivityList } from "@/services/apiActivity";
import type { ActivityType, UserActivitiesQuery } from "@/types/activity";
import type { CursorPageRequest } from "@/types/comment";
import { useInfiniteQuery } from "@tanstack/react-query";

type ActivityQueryType = "all" | "claps" | "responses";

type ActivityTypesMap = {
  all: ActivityType[];
  claps: ActivityType[];
  responses: ActivityType[];
};

export function useGetInfiniteActivityList(
  userId: string,
  activityQueryType: ActivityQueryType,
) {
  const activityTypesMap: ActivityTypesMap = {
    all: ["POST_CLAPPED", "RESPONSE_CREATED"],
    claps: ["POST_CLAPPED"],
    responses: ["RESPONSE_CREATED"],
  };
  return useInfiniteQuery({
    queryKey: ["get-user-activities", userId, activityQueryType],
    queryFn: async ({ pageParam }: { pageParam: CursorPageRequest }) => {
      return await getUserActivityList({
        params: {
          ...pageParam,
          userId,
          activityTypes: activityTypesMap[activityQueryType],
        } as UserActivitiesQuery,
      });
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
}
