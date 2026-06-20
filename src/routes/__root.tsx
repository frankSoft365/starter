import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'sonner'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import Auth from '../components/Auth'
import { DevTools } from 'jotai-devtools'
import 'jotai-devtools/styles.css'

const queryClient = new QueryClient()
// "^19.2.14" "@types/react"
// "^19.2.5" "react"

const RootLayout = () => (
    <>
        <QueryClientProvider client={queryClient}>
            <Auth>
                <Outlet />
                <Toaster position="top-center" richColors duration={2000} gap={28} />
                <TanStackRouterDevtools />
                <DevTools position='bottom-right' />
            </Auth>
        </QueryClientProvider>
    </>
)

export const Route = createRootRoute({
    component: RootLayout,
})