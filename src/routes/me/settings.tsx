import { createFileRoute } from '@tanstack/react-router'
import RootLayout from '../../components/RootLayout';
import SettingsPage from '../../components/SettingsPage';
import SignedIn from '../../components/SignedIn';
import SignedOut from '../../components/SignedOut';
import NeedLogin from '../../components/NeedLogin';
import Loading from '../../components/Loading';
import { useAtomValue } from 'jotai';
import { isLoadingAtom } from '../../stores/user';

export const Route = createFileRoute('/me/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const isLoading = useAtomValue(isLoadingAtom);
  return (
    <RootLayout>
      <SignedIn>
        <SettingsPage />
      </SignedIn>
      {isLoading && <Loading />}
      {!isLoading && <SignedOut>
        <NeedLogin />
      </SignedOut>}
    </RootLayout>
  );
}
