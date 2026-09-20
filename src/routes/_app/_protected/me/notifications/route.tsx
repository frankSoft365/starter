import NotificationsLayout from "@/features/notifications/NotificationsLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_protected/me/notifications")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <NotificationsLayout>
      <Outlet />
    </NotificationsLayout>
  );
}
