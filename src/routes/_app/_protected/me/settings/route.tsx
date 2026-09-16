import SettingsLayout from "@/features/settings/SettingsLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_protected/me/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SettingsLayout>
      <Outlet />
    </SettingsLayout>
  );
}
