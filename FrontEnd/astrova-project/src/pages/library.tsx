import { createFileRoute } from '@tanstack/react-router'
import HeaderComponent from '../components/headerComponent'

export const Route = createFileRoute('/library')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="min-h-screen flex flex-col pt-16 relative">
            <HeaderComponent
                title='Earth Polychromatic Imaging Camera'
                description='Full-disc Earth imagery from the DSCOVR spacecraft'
                showCalendarFilter={false}
            />

            <div className="container max-w-7xl mx-auto py-12 md:pt-48 px-4">

            </div>
        </div>
    )
}
