// src/routes/apod.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getApod } from '../services/nasa';
import { Button } from '../components/ui/button';
import { Calendar as CalendarIcon, Download } from 'lucide-react';


export const Route = createFileRoute('/apod')({
    component: ApodPage,
})


export function ApodPage() {
    const date = new Date().toISOString().split('T')[0]; // "2026-03-16"

    const { data: apodData, isLoading, error } = useQuery({
        queryKey: ['apod', date],
        queryFn: () => getApod(date),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Something went wrong</div>




    return (
        <div className="min-h-screen flex flex-col pt-16">


            {/* Header Section */}
            <div className="border-b border-white/5 bg-surface/30 backdrop-blur-sm">
                <div className="container w-full py-8 px-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                                <span className="text-soft-white">Astronomy Picture </span>
                                <span className="text-primary">of the Day</span>
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Discover the cosmos through NASA's daily featured images
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container max-w-7xl mx-auto py-12 px-4 justify-center">

                <div className="grid gap-8 max-w-6xl mx-auto">

                    <div key={apodData?.date}>
                        {/* Hero Image */}
                        <div className="relative overflow-hidden rounded-2xl group mb-6">
                            {apodData?.media_type === 'image' ? (
                                <div className="relative">
                                    <img
                                        src={apodData?.url}
                                        alt={apodData?.title}
                                        className="w-full h-auto min-h-[400px] md:min-h-[600px] object-cover"
                                    />
                                    {/* Dark overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80" />

                                    {/* Title overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                        <div className="flex items-center gap-2 text-cyan text-sm mb-3">
                                            <CalendarIcon className="h-4 w-4" />
                                            <span>{apodData?.date}</span>
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-bold text-soft-white mb-4">
                                            {apodData?.title}
                                        </h2>
                                        {apodData?.copyright && (
                                            <p className="text-sm text-cyan">
                                                © {apodData?.copyright}
                                            </p>
                                        )}
                                    </div>

                                    {/* Download button on hover */}
                                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="sm"
                                            className="bg-cyan/90 hover:bg-cyan text-background backdrop-blur-sm shadow-lg"
                                            asChild
                                        >
                                            <a href={apodData?.hdurl || apodData?.url} target="_blank" rel="noopener noreferrer">
                                                <Download className="h-4 w-4 mr-2" />
                                                HD Image
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-video bg-background rounded-2xl overflow-hidden">
                                    <iframe
                                        src={apodData?.url}
                                        title={apodData?.title}
                                        className="w-full h-full"
                                        allowFullScreen
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}