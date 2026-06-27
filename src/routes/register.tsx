import { createFileRoute } from '@tanstack/react-router'
import RegisterForm from '../features/auth/RegisterForm';
import SignedOut from '../ui/SignedOut';
import SignedIn from '../ui/SignedIn';
import RedirectToHome from '../ui/RedirectToHome';

export const Route = createFileRoute('/register')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <SignedOut>
                <main className='min-h-screen flex justify-center items-center'>
                    <RegisterForm />
                </main>
            </SignedOut>
            <SignedIn>
                <RedirectToHome />
            </SignedIn>
        </>
    );
}
