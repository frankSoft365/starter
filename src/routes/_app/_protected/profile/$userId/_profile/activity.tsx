import ActivityList from "@/features/activity/ActivityList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_app/_protected/profile/$userId/_profile/activity",
)({
  component: ActivityList,
});
