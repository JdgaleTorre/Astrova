// src/routes/apod.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apod')({
    component: ApodPage,
})

function ApodPage() {
    return <div>APOD Page</div>
}