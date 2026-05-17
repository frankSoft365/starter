import { createFileRoute } from '@tanstack/react-router'
import RootLayout from '../components/RootLayout';

export const Route = createFileRoute('/$emailname')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <RootLayout>
            <div>Hello "/$emailname"!</div>
        </RootLayout>
    );
}
