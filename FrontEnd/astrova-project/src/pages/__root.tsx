import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Header } from '../components/header'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'



export const Route = createRootRoute({
    component: () => (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                <Outlet />
                {import.meta.env.DEV && <TanStackRouterDevtools />}
            </main>
        </div>

    ),
})