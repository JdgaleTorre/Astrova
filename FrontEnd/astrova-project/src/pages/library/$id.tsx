import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { Button, buttonVariants } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Loading } from '../../components/ui/loading'
import { ErrorDisplay } from '../../components/ui/error'
import { useQuery } from '@tanstack/react-query'
import { getImageById } from '../../services/nasa'
import { ArrowLeft, Calendar, Camera, Download, ExternalLink, Image, Video, Volume2 } from 'lucide-react'
import { format } from 'date-fns'
import { getMediaUrl } from '../../utils/metadata'

export const Route = createFileRoute('/library/$id')({
    component: LibraryDetailPage,
})

function LibraryDetailPage() {
    const { id } = useParams({ from: '/library/$id' })

    const { data, isLoading, error } = useQuery({
        queryKey: ['library-item', id],
        queryFn: () => getImageById(id),
        enabled: !!id,
    })

    if (isLoading) return <Loading />

    if (error) return < div className="min-h-screen flex flex-col pt-16 relative" > <ErrorDisplay error={error} /></div>

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col pt-16 relative">
                <div className="container max-w-7xl mx-auto py-12 md:pt-32 px-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-soft-white mb-4">Item not found</h1>
                        <Button asChild>
                            <Link to="/library">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Library
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    const { metadata, assets } = data;
    const item = metadata.data[0];
    const mediaType = item.media_type;
    const mediaUrl = getMediaUrl(assets, mediaType);

    return (
        <div className="min-h-screen flex flex-col pt-16 relative">
            <div className="container max-w-7xl mx-auto py-8 md:pt-24 px-4">
                <Link
                    to="/library"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-cyan transition-colors mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Library</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                    <div className="lg:col-span-3">
                        <div className="relative rounded-2xl overflow-hidden bg-surface">
                            {mediaType === 'image' ? (
                                <img
                                    src={mediaUrl}
                                    alt={item.title}
                                    className="w-full h-auto"
                                />
                            ) : mediaType === 'video' ? (
                                <video
                                    src={mediaUrl}
                                    title={item.title}
                                    className="w-full aspect-video"
                                    controls
                                />
                            ) : (
                                <div className="min-h-96 bg-surface flex items-center justify-center">
                                    <audio
                                        src={mediaUrl}
                                        controls
                                        className="w-full max-w-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <Card className="bg-card/50 backdrop-blur-sm border-white/5 sticky top-24">
                            <CardHeader className="p-6 pb-4">
                                <CardTitle className="text-xl text-soft-white leading-relaxed">
                                    {item.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-6 pt-0 space-y-6">
                                <p className="text-muted-foreground text-sm leading-relaxed max-h-80 overflow-auto">
                                    {item.description || 'No description available.'}
                                </p>

                                <div className="space-y-3 pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="h-4 w-4 text-cyan" />
                                        <span className="text-muted-foreground">
                                            {item.date_created
                                                ? format(new Date(item.date_created), 'MMMM d, yyyy')
                                                : 'Unknown date'}
                                        </span>
                                    </div>

                                    {item.photographer && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Camera className="h-4 w-4 text-cyan" />
                                            <span className="text-muted-foreground">
                                                {item.photographer}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 text-sm">
                                        {mediaType === 'video' ? (
                                            <Video className="h-4 w-4 text-cyan" />
                                        ) : mediaType === 'audio' ? (
                                            <Volume2 className="h-4 w-4 text-cyan" />
                                        ) : (
                                            <Image className="h-4 w-4 text-cyan" />
                                        )}
                                        <span className="text-muted-foreground capitalize">
                                            {mediaType}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 justify-end">
                                    <a className={buttonVariants({ variant: "outline", size: "sm" })} href={mediaUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        View Original
                                    </a>
                                    <a className={buttonVariants({ size: "sm" })} href={mediaUrl} target="_blank" rel="noopener noreferrer" download>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
