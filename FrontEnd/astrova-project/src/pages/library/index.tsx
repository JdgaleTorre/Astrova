import { createFileRoute, useNavigate } from '@tanstack/react-router';
import HeaderComponent from '../../components/headerComponent';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Loading } from '../../components/ui/loading';
import { ErrorDisplay } from '../../components/ui/error';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchImages, type ImageSearchParams } from '../../services/nasa';
import { Search, Image, Video, Calendar, Volume2 } from 'lucide-react';
import { format } from 'date-fns';

export const Route = createFileRoute('/library/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState<
    'all' | 'image' | 'video' | 'audio'
  >('all');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const params: ImageSearchParams = {
    q: debouncedQuery,
    media_type: selectedMediaType === 'all' ? undefined : selectedMediaType,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['library-search', debouncedQuery, selectedMediaType],
    queryFn: () => searchImages(params),
    enabled: debouncedQuery.trim().length > 0,
  });

  const results = data?.collection?.items || [];

  return (
    <div className="relative flex min-h-screen flex-col pt-16">
      <HeaderComponent
        title="NASA Image and Video Library"
        description="Discover our intergalactic multimedia collections"
        showCalendarFilter={false}
      />

      <div className="container mx-auto max-w-7xl px-4 py-12 md:pt-48">
        <div className="mx-auto mb-12 max-w-2xl">
          <div className="relative flex gap-2">
            <Input
              type="text"
              placeholder="Search NASA images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface/50 focus:border-cyan/50 border-white/10 pr-12"
            />
            <Button
              size="icon"
              variant="ghost"
              className="text-cyan hover:bg-cyan/10 absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
              disabled={isLoading}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          {debouncedQuery && !isLoading && (
            <p className="text-muted-foreground mt-3 text-center text-sm">
              {results.length} {results.length === 1 ? 'result' : 'results'} for
              "{debouncedQuery}"
            </p>
          )}

          <div className="mt-4 flex justify-center gap-2">
            <Button
              variant={selectedMediaType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMediaType('all')}
              className="border-cyan/20 hover:bg-cyan/10 hover:border-cyan/40"
            >
              All
            </Button>
            <Button
              variant={selectedMediaType === 'image' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMediaType('image')}
              className="border-cyan/20 hover:bg-cyan/10 hover:border-cyan/40"
            >
              <Image className="mr-1 h-4 w-4" />
              Images
            </Button>
            <Button
              variant={selectedMediaType === 'video' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMediaType('video')}
              className="border-cyan/20 hover:bg-cyan/10 hover:border-cyan/40"
            >
              <Video className="mr-1 h-4 w-4" />
              Videos
            </Button>
            <Button
              variant={selectedMediaType === 'audio' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMediaType('audio')}
              className="border-cyan/20 hover:bg-cyan/10 hover:border-cyan/40"
            >
              Audio
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl">
          {isLoading && <Loading />}

          {error && <ErrorDisplay error={error} />}

          {!isLoading && !error && !debouncedQuery && (
            <div className="py-16 text-center">
              <Search className="text-muted-foreground/40 mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground text-xl">
                Enter a search term to find NASA images
              </p>
            </div>
          )}

          {!isLoading && !error && debouncedQuery && results.length === 0 && (
            <div className="py-16 text-center">
              <Image className="text-muted-foreground/40 mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground text-xl">
                No images found for "{debouncedQuery}"
              </p>
              <p className="text-muted-foreground/60 mt-2 text-sm">
                Try a different search term
              </p>
            </div>
          )}

          {!isLoading && !error && results.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((item) => {
                const nasaId = item.data[0]?.nasa_id;
                const imageUrl =
                  item.links?.find((link) => link.render === 'image')?.href ||
                  item.href;
                const title = item.data[0]?.title || 'Untitled';
                const date = item.data[0]?.date_created
                  ? format(new Date(item.data[0].date_created), 'MMM d, yyyy')
                  : 'Unknown date';
                const mediaType = item.data[0]?.media_type || 'image';

                if (!nasaId) return null;

                return (
                  <div
                    key={nasaId}
                    onClick={() =>
                      navigate({ to: '/library/$id', params: { id: nasaId } })
                    }
                    className="block cursor-pointer"
                  >
                    <Card className="bg-card/50 group hover:border-cyan/30 h-full overflow-hidden border-white/5 backdrop-blur-sm transition-all">
                      <div className="bg-surface relative aspect-square overflow-hidden">
                        {mediaType === 'audio' ? (
                          <div className="from-cyan/20 flex h-full w-full items-center justify-center bg-linear-to-br to-purple-500/20">
                            <Volume2 className="text-cyan/50 h-16 w-16" />
                          </div>
                        ) : (
                          <img
                            src={imageUrl}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        )}
                        <div className="absolute top-2 right-2">
                          <span className="bg-background/80 inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                            {mediaType === 'video' ? (
                              <Video className="text-cyan h-3 w-3" />
                            ) : mediaType === 'audio' ? (
                              <Volume2 className="text-cyan h-3 w-3" />
                            ) : (
                              <Image className="text-cyan h-3 w-3" />
                            )}
                            <span className="text-soft-white capitalize">
                              {mediaType}
                            </span>
                          </span>
                        </div>
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-soft-white line-clamp-2 text-sm font-medium">
                          {title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="flex items-center justify-between">
                          <div className="text-muted-foreground flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            <span>{date}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
