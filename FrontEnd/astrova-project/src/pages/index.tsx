// src/routes/apod.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles, ExternalLink, ChevronDown } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Starfield } from '../components/starfield'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'
import { FEATURED_LINKS } from '../utils/navigationLinks'
import { TECH_STACK } from '../utils/techStack.tsx'
import { useState } from 'react'

export const Route = createFileRoute('/')({
    component: IndexPage,
})

function IndexPage() {
    const [isTechStackOpen, setIsTechStackOpen] = useState(false)

    return <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

            <Starfield />
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

        <section className="py-24 relative">
            <div className="container px-4 mx-auto ">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="text-soft-white">Discover </span>
                        <span className="text-cyan">Space Data</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Access real-time data from NASA's missions and observatories
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {FEATURED_LINKS.map((link => (
                        <Link key={link.path} to={link.path} className="group">
                            <Card className={`h-full bg-card/50 backdrop-blur-sm border-white/5 hover:border-${link.color}/20 hover:shadow-xl hover:shadow-${link.color}/10 transition-all duration-300 hover:-translate-y-1`}>
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-lg bg-${link.color}/10 flex items-center justify-center mb-4 group-hover:bg-${link.color}/20 transition-colors`}>
                                        {link.icon}
                                    </div>
                                    <CardTitle className={`text-soft-white group-hover:text-${link.color} transition-colors`}>
                                        {link.label}
                                    </CardTitle>
                                    <CardDescription>
                                        {link.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className={`flex items-center text-sm text-${link.color} group-hover:gap-2 transition-all`}>
                                        <span>Explore</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )))}

                </div>
            </div>
        </section>

        <section className="py-24 relative">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="text-soft-white">About </span>
                        <span className="text-cyan">This Project</span>
                    </h2>
                </div>

                <Card className="max-w-5xl mx-auto bg-card/50 backdrop-blur-sm border-white/5">
                    <CardContent className="p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <Sparkles className="h-8 w-8 text-cyan" />
                                    <div>
                                        <h3 className="text-2xl font-bold text-soft-white">Astrova</h3>
                                        <p className="text-cyan text-sm">NASA Space Explorer</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    An interactive full-stack web application that brings NASA's universe of space data to life through stunning visualizations, real-time data, and a sleek space-themed interface.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    The backend acts as a secure proxy between the frontend and NASA's APIs, keeping your API key safe and handling data transformation before it reaches you.
                                </p>
                            </div>

                            <div className="flex flex-col justify-between">
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-soft-white">Key Features</h4>
                                    <div className="space-y-3">
                                        {FEATURED_LINKS.map((link) => (
                                            <div key={link.path} className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg bg-${link.color}/10 flex items-center justify-center`}>
                                                    {link.icon}
                                                </div>
                                                <div>
                                                    <span className="text-soft-white font-medium">{link.label}</span>
                                                    <p className="text-xs text-muted-foreground">{link.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <Button
                                        asChild
                                        className="w-full bg-cyan hover:bg-cyan/90 text-background"
                                    >
                                        <Link to="/apod">
                                            Start Exploring
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>

        <section className="py-24 bg-surface/30">
            <div className="container px-4 mx-auto">
                <button
                    onClick={() => setIsTechStackOpen(!isTechStackOpen)}
                    className="w-full text-center group mb-8"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="text-soft-white">Our </span>
                        <span className="text-cyan">Tech Stack</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4">
                        The tools and technologies powering this application
                    </p>
                    <ChevronDown
                        className={`h-6 w-6 text-muted-foreground mx-auto transition-transform duration-300 ${isTechStackOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                <div
                    className={`grid gap-8 md:grid-cols-2 lg:grid-cols-3 transition-all duration-300 ease-in-out ${isTechStackOpen ? 'opacity-100 max-h-500' : 'opacity-0 max-h-0 overflow-hidden'
                        }`}
                >
                    {TECH_STACK.map((section) => (
                        <Card key={section.category} className="bg-card/50 backdrop-blur-sm border-white/5">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-cyan/10 flex items-center justify-center">
                                    {section.icon}
                                </div>
                                <CardTitle className="text-soft-white">{section.category}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {section.items.map((item) => {
                                        const IconComponent = item.Icon
                                        return (
                                            <a
                                                key={item.name}
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                                            >
                                                <div className="shrink-0 w-8 h-8 flex items-center justify-center text-cyan group-hover:scale-110 transition-transform">
                                                    <IconComponent className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-soft-white group-hover:text-cyan transition-colors block">
                                                        {item.name}
                                                    </span>
                                                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                                                </div>
                                                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-cyan transition-colors shrink-0" />
                                            </a>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    </div>
}