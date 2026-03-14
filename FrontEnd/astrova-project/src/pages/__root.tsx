import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Header } from '../components/Header'


export const Route = createRootRoute({
    component: () => (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                <Outlet />
            </main>
        </div>

    ),
})