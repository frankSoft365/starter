import CardDetail from "@/features/helpCenter/CardDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/hc/categories/$cardId")({
  component: CardDetail,
});
