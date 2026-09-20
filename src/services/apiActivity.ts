import type { UserActivitiesQuery, UserActivity } from "@/types/activity";
import type { CursorPage } from "@/types/comment";
import request from "@/utils/request";

export async function getUserActivityList({
  params,
}: {
  params: UserActivitiesQuery;
}) {
  return request.post<UserActivitiesQuery, CursorPage<UserActivity>>(
    "/activity/list",
    params,
  );
}
