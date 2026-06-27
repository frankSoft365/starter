import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'sonner'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { DevTools } from 'jotai-devtools'
import 'jotai-devtools/styles.css'
import Auth from '@/features/auth/Auth'

const queryClient = new QueryClient();

const RootLayout = () => (
    <>
        <QueryClientProvider client={queryClient}>
            <Auth>
                <Outlet />
                <Toaster position="top-center" richColors duration={2000} gap={28} />

            </Auth>
            <TanStackRouterDevtools />
            <DevTools position='bottom-right' />
        </QueryClientProvider>
    </>
)

export const Route = createRootRoute({
    component: RootLayout,
})