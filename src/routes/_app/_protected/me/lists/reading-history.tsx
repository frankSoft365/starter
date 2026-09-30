import ReadingHistoryPage from "@/features/readingHistory/ReadingHistoryPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_app/_protected/me/lists/reading-history",
)({
  component: ReadingHistoryPage,
});
