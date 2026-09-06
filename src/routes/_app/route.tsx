import {
  createFileRoute,
  Outlet,
  stripSearchParams,
} from "@tanstack/react-router";
import RootLayout from "@/ui/RootLayout";
import { SearchParamSchema } from "@/schemas/searchParam";
import { zodValidator } from "@tanstack/zod-adapter";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  validateSearch: zodValidator(SearchParamSchema),
  search: {
    middlewares: [stripSearchParams({ q: "" })],
  },
});

function RouteComponent() {
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
}
