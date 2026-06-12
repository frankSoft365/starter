import { createFileRoute } from '@tanstack/react-router'
import RootLayout from '../components/RootLayout';
import ArticleEditor from '../components/ArticleEditor';
import SignedIn from '../components/SignedIn';
import SignedOut from '../components/SignedOut';
import { useAtomValue } from 'jotai';
import { isLoadingAtom } from '../stores/user';
import Loading from '../components/Loading';
import NeedLogin from '../components/NeedLogin';

export const Route = createFileRoute('/editor')({
    component: RouteComponent,
})

function RouteComponent() {
    const isLoading = useAtomValue(isLoadingAtom);

    return (
        <RootLayout>
            <SignedIn>
                <ArticleEditor />
            </SignedIn>
            {isLoading && <Loading />}
            {!isLoading && <SignedOut>
                <NeedLogin />
            </SignedOut>}
        </RootLayout>
    );
}
