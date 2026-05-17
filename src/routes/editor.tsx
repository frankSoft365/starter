import { createFileRoute, redirect } from '@tanstack/react-router'
import RootLayout from '../components/RootLayout';
import ArticleEditor from '../components/ArticleEditor';
import { getDefaultStore } from 'jotai';
import { isLoginAtom } from '../stores/user';
import { Route as loginRoute } from "../routes/login";

const store = getDefaultStore();

export const Route = createFileRoute('/editor')({
    component: RouteComponent,
    beforeLoad: ({ location }) => {
        // redirect to login when isNOTlogin and visit editor
        const isLogin = store.get(isLoginAtom);
        if (!isLogin) {
            throw redirect({
                to: loginRoute.to,
                search: {
                    redirect: location.href
                }
            })
        }
    }
})

function RouteComponent() {
    return (
        <RootLayout>
            <ArticleEditor />
        </RootLayout>
    );
}
