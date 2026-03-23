import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { Button, buttonVariants } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Loading } from '../../components/ui/loading';
import { ErrorDisplay } from '../../components/ui/error';
import { useQuery } from '@tanstack/react-query';
import { getImageById } from '../../services/nasa';
import {
  ArrowLeft,
  Calendar,
  Camera,
  Download,
  ExternalLink,
  Image,
  Video,
  Volume2,
} from 'lucide-react';
import { format } from 'date-fns';
import { getMediaUrl } from '../../utils/metadata';

export const Route = createFileRoute('/library/$id')({
  component: LibraryDetailPage,
});

function LibraryDetailPage() {
  const { id } = useParams({ from: '/library/$id' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['library-item', id],
    queryFn: () => getImageById(id),
    enabled: !!id,
  });

  if (isLoading) return <Loading />;

  if (error)
    return (
      <div className="relative flex min-h-screen flex-col pt-16">
        {' '}
        <ErrorDisplay error={error} />
      </div>
    );

  if (!data) {
    return (
      <div className="relative flex min-h-screen flex-col pt-16">
        <div className="container mx-auto max-w-7xl px-4 py-12 md:pt-32">
          <div className="text-center">
            <h1 className="text-soft-white mb-4 text-2xl font-bold">
              Item not found
            </h1>
            <Button asChild>
              <Link to="/library">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Library
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { metadata, assets } = data;
  const item = metadata.data[0];
  const mediaType = item.media_type;
  const mediaUrl = getMediaUrl(assets, mediaType);

  return (
    <div className="relative flex min-h-screen flex-col pt-16">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:pt-24">
        <Link
          to="/library"
          className="text-muted-foreground hover:text-cyan mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Library</span>
        </Link>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="bg-surface relative overflow-hidden rounded-2xl">
              {mediaType === 'image' ? (
                <img
                  src={mediaUrl}
                  alt={item.title}
                  className="h-auto w-full"
                />
              ) : mediaType === 'video' ? (
                <video
                  src={mediaUrl}
                  title={item.title}
                  className="aspect-video w-full"
                  controls
                />
              ) : (
                <div className="bg-surface flex min-h-96 items-center justify-center">
                  <audio src={mediaUrl} controls className="w-full max-w-md" />
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-card/50 sticky top-24 border-white/5 backdrop-blur-sm">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-soft-white text-xl leading-relaxed">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 p-6 pt-0">
                <p className="text-muted-foreground max-h-80 overflow-auto text-sm leading-relaxed">
                  {item.description || 'No description available.'}
                </p>

                <div className="space-y-3 border-t border-white/10 pt-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="text-cyan h-4 w-4" />
                    <span className="text-muted-foreground">
                      {item.date_created
                        ? format(new Date(item.date_created), 'MMMM d, yyyy')
                        : 'Unknown date'}
                    </span>
                  </div>

                  {item.photographer && (
                    <div className="flex items-center gap-3 text-sm">
                      <Camera className="text-cyan h-4 w-4" />
                      <span className="text-muted-foreground">
                        {item.photographer}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    {mediaType === 'video' ? (
                      <Video className="text-cyan h-4 w-4" />
                    ) : mediaType === 'audio' ? (
                      <Volume2 className="text-cyan h-4 w-4" />
                    ) : (
                      <Image className="text-cyan h-4 w-4" />
                    )}
                    <span className="text-muted-foreground capitalize">
                      {mediaType}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <a
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'sm',
                    })}
                    href={mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Original
                  </a>
                  <a
                    className={buttonVariants({ size: 'sm' })}
                    href={mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
