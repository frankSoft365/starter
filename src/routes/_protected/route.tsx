import RequireLogin from "@/ui/utils/RequireLogin";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RequireLogin>
      <Outlet />
    </RequireLogin>
  );
}
