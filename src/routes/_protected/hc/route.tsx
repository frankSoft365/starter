import { HelpCenterLayout } from "@/features/helpCenter/HelpCenterLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/hc")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <HelpCenterLayout>
      <Outlet />
    </HelpCenterLayout>
  );
}
