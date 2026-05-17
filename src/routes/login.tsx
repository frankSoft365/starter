import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '../components/LoginForm'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className='min-h-screen flex justify-center items-center'>
      <LoginForm />
    </main>
  );
}
