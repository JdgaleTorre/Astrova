// src/routes/apod.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/')({
    component: IndexPage,
})

function IndexPage() {
    return <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

            {/* Subtle grain texture overlay */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />

            <div className="container relative z-10 text-center px-4">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-sm mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span>Powered by NASA's Open APIs</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                        <span className="text-soft-white">Explore the </span>
                        <span className="relative inline-block">
                            <span className="text-cyan relative z-10">cosmos</span>
                            <span className="absolute inset-0 blur-2xl bg-cyan/30" />
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                        One data point at a time
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                        <Button
                            size="lg"
                            asChild
                            className="bg-cyan hover:bg-cyan/90 text-background shadow-lg shadow-cyan/30 hover:shadow-cyan/50 transition-all px-8"
                        >
                            <Link to="/apod">
                                Start Exploring
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            asChild
                            className="border-white/10 hover:bg-white/5 hover:border-cyan/20 px-8"
                        >
                            <a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer">
                                Learn More
                            </a>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 rounded-full border-2 border-cyan/30 flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-cyan/50 rounded-full" />
                </div>
            </div>
        </section>
    </div>
}