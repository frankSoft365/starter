import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/search/_search/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <h1>The article list</h1>;
}
