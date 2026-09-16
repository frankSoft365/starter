import SettingsAccount from "@/features/account/SettingsAccount";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_protected/me/settings/")({
  component: SettingsAccount,
});
