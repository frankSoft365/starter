import { createFileRoute } from "@tanstack/react-router";
import NeedLogin from "../../ui/utils/NeedLogin";

export const Route = createFileRoute("/_app/needLogin")({
  component: RouteComponent,
});

function RouteComponent() {
  return <NeedLogin />;
}
