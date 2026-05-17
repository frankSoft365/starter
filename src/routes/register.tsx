import { createFileRoute } from '@tanstack/react-router'
import RegisterForm from '../components/RegisterForm';

export const Route = createFileRoute('/register')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <main className='min-h-screen flex justify-center items-center'>
            <RegisterForm />
        </main>
    );
}
