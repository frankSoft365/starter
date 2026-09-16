import SettingsLanguage from "@/features/settings/SettingsLanguage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_protected/me/settings/language")({
  component: SettingsLanguage,
});
