import { createFileRoute } from '@tanstack/react-router'
import SignedOut from '../ui/SignedOut';
import SignedIn from '../ui/SignedIn';
import RedirectToHome from '../ui/RedirectToHome';
import LoginForm from '@/features/auth/LoginForm';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <SignedOut>
        <main className='min-h-screen flex justify-center items-center'>
          <LoginForm />
        </main>
      </SignedOut>
      <SignedIn>
        <RedirectToHome />
      </SignedIn>
    </>
  );
}
