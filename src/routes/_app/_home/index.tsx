import ForYouArticleList from "@/features/home/ForYouArticleList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_home/")({
  component: ForYouArticleList,
});
