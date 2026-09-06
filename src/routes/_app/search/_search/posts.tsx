import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/search/_search/posts")({
  component: RouteComponent,
});

function RouteComponent() {
  return <h1>The article list</h1>;
}
