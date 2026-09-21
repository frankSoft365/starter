import LibraryLayout from "@/features/library/LibraryLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_protected/me/lists")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <LibraryLayout>
      <Outlet />
    </LibraryLayout>
  );
}
