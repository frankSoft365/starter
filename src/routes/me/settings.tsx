import { createFileRoute } from '@tanstack/react-router'
import RootLayout from '../../components/RootLayout';
import SettingsPage from '../../components/SettingsPage';

export const Route = createFileRoute('/me/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <RootLayout>
      <SettingsPage />
    </RootLayout>
  );
}
