import SettingsPage from '@/features/account/SettingsPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_protected/me/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SettingsPage />
  );
}
