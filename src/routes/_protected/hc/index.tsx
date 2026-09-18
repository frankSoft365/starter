import HomeGrid from "@/features/helpCenter/HomeGrid";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/hc/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HomeGrid />;
}
