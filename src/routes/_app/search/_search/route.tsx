import SearchPage from "@/ui/SearchPage";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/search/_search")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SearchPage>
      <Outlet />
    </SearchPage>
  );
}
