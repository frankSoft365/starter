import { createFileRoute } from '@tanstack/react-router'
import RootLayout from '../components/RootLayout';
import SignedIn from '../components/SignedIn';
import SignedOut from '../components/SignedOut';
import NeedLogin from '../components/NeedLogin';
import { useAtomValue } from 'jotai';
import { isLoadingAtom } from '../stores/user';
import Loading from '../components/Loading';

export const Route = createFileRoute('/$emailname')({
    component: RouteComponent,
})

function RouteComponent() {
    const isLoading = useAtomValue(isLoadingAtom);
    return (
        <RootLayout>
            <SignedIn>
                <div>Hello "/$emailname"!</div>
            </SignedIn>
            {isLoading && <Loading />}
            {!isLoading && <SignedOut>
                <NeedLogin />
            </SignedOut>}
        </RootLayout>
    );
}
