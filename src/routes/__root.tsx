import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'sonner'
import { getDefaultStore } from 'jotai'
import { tokenAtom, userAtom } from '../stores/user'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { getUserProfile } from '../utils/userProfileHelper'
import type { UserVO } from '../types/UserVO'

const store = getDefaultStore()

const queryClient = new QueryClient()

const RootLayout = () => (
    <>
        <QueryClientProvider client={queryClient}>
            <Outlet />
            <Toaster position="top-center" richColors />
            <TanStackRouterDevtools />
        </QueryClientProvider>
    </>
)

export const Route = createRootRoute({
    component: RootLayout,
    beforeLoad: async () => {
        const token = JSON.parse(localStorage.getItem('token') || 'null');

        if (!token) {
            store.set(tokenAtom, null)
            store.set(userAtom, null)
            return
        }

        try {
            const userInfo: UserVO = await getUserProfile();
            store.set(userAtom, userInfo)
            store.set(tokenAtom, token)
        } catch (err) {
            store.set(tokenAtom, null)
            store.set(userAtom, null)
            localStorage.removeItem('token')
        }

    },
})