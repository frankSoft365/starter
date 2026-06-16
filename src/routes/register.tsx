import { createFileRoute } from '@tanstack/react-router'
import RegisterForm from '../components/RegisterForm';
import SignedOut from '../components/SignedOut';
import SignedIn from '../components/SignedIn';
import RedirectToHome from '../components/RedirectToHome';

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
