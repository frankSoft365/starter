import { createFileRoute, redirect } from '@tanstack/react-router'
import RootLayout from '../../components/RootLayout';
import SettingsPage from '../../components/SettingsPage';
import { getDefaultStore } from 'jotai';
import { isLoginAtom } from '../../stores/user';
import { Route as NeedLoginRoute } from '../../routes/needLogin';

const store = getDefaultStore();

export const Route = createFileRoute('/me/settings')({
  component: RouteComponent,
  beforeLoad: () => {
    // redirect to login when isNOTlogin and visit editor
    const isLogin = store.get(isLoginAtom);
    if (!isLogin) {
      throw redirect({
        to: NeedLoginRoute.to,
      })
    }
  }
})

function RouteComponent() {
  return (
    <RootLayout>
      <SettingsPage />
    </RootLayout>
  );
}
