import { createFileRoute } from '@tanstack/react-router'
import SettingsPage from '../../../../components/SettingsPage';

export const Route = createFileRoute('/_app/_protected/me/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SettingsPage />
  );
}
