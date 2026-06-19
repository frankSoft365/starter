import { createFileRoute } from '@tanstack/react-router'
import ChangePasswordForm from '../../../../components/ChangePasswordForm'

export const Route = createFileRoute('/_app/_protected/me/password')({
    component: RouteComponent,
})

function RouteComponent() {

    return (
        <ChangePasswordForm />
    );

}
