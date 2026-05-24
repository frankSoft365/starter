import { createFileRoute } from '@tanstack/react-router'
import RootLayout from '../components/RootLayout';
import NeedLogin from '../components/NeedLogin';

export const Route = createFileRoute('/needLogin')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <RootLayout>
            <NeedLogin />
        </RootLayout>
    );
}
