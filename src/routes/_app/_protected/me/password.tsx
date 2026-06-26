import ChangePasswordForm from '@/components/ChangePasswordForm';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_protected/me/password')({
    component: RouteComponent,
})

function RouteComponent() {

    return (
        <ChangePasswordForm />
    );

}
