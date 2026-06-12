import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '../components/LoginForm'
import SignedOut from '../components/SignedOut';
import SignedIn from '../components/SignedIn';
import RedirectToHome from '../components/RedirectToHome';

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
