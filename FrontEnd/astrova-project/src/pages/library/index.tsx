import { createFileRoute } from '@tanstack/react-router';
import HeaderComponent from '../../components/headerComponent';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Loading } from '../../components/ui/loading';
import { ErrorDisplay } from '../../components/ui/error';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchImages, type ImageSearchParams } from '../../services/nasa';
import { Search, Image, Video } from 'lucide-react';
import LibraryCard from '../../components/libraryCard';

export const Route = createFileRoute('/library/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState<
    'all' | 'image' | 'video' | 'audio'
  >('all');

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
              {results.map((item) => (
                <div key={item.data[0]?.nasa_id}>
                  <LibraryCard {...item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
