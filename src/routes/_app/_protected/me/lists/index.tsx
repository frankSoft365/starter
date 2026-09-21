import LibraryLists from "@/features/library/LibraryLists";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_protected/me/lists/")({
  component: LibraryLists,
});
