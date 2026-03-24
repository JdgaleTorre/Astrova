import { ArrowUpDown, ChevronDown, Ruler } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import AsteroidCard from './astroidCard';
import type { NeoAsteroid, NeoFeedResponse } from '../services/nasa';
import { useState } from 'react';
import { format } from 'date-fns';

type HazardFilter = 'all' | 'hazardous' | 'safe';
type SizeFilter = 'all' | 'small' | 'medium' | 'large';
type SortBy = 'distance' | 'velocity' | 'size';

export default function NeoRawData(data: NeoFeedResponse) {
  const [hazardFilter, setHazardFilter] = useState<HazardFilter>('all');
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('distance');
  const sortedDates = data ? Object.keys(data.near_earth_objects).sort() : [];
  const allAsteroids = data
    ? Object.values(data.near_earth_objects).flat()
    : [];
  const hazardousCount = allAsteroids.filter(
    (a) => a.is_potentially_hazardous_asteroid,
  ).length;
  const filterAsteroids = (asteroids: NeoAsteroid[]) => {
    return asteroids
      .filter((a) => {
        if (
          hazardFilter === 'hazardous' &&
          !a.is_potentially_hazardous_asteroid
        )
          return false;
        if (hazardFilter === 'safe' && a.is_potentially_hazardous_asteroid)
          return false;

        const avgDiameter =
          (a.estimated_diameter.meters.estimated_diameter_min +
            a.estimated_diameter.meters.estimated_diameter_max) /
          2;
        if (sizeFilter === 'small' && avgDiameter >= 100) return false;
        if (sizeFilter === 'medium' && (avgDiameter < 100 || avgDiameter > 500))
          return false;
        if (sizeFilter === 'large' && avgDiameter <= 500) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') {
          return a.close_approach_data[0].miss_distance.lunar.localeCompare(
            b.close_approach_data[0].miss_distance.lunar,
          );
        }
        if (sortBy === 'velocity') {
          return (
            parseFloat(
              b.close_approach_data[0].relative_velocity.kilometers_per_hour,
            ) -
            parseFloat(
              a.close_approach_data[0].relative_velocity.kilometers_per_hour,
            )
          );
        }
        const sizeA =
          (a.estimated_diameter.meters.estimated_diameter_min +
            a.estimated_diameter.meters.estimated_diameter_max) /
          2;
        const sizeB =
          (b.estimated_diameter.meters.estimated_diameter_min +
            b.estimated_diameter.meters.estimated_diameter_max) /
          2;
        return sizeB - sizeA;
      });
  };

  const getFilteredCount = () => filterAsteroids(allAsteroids).length;
  return (
    <>
      <div className="bg-card/30 z-50 mb-6 flex flex-col gap-4 rounded-lg border border-white/5 p-4 backdrop-blur-sm sm:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-sm">Filter:</span>
          <div className="flex overflow-hidden rounded-md border border-white/10">
            <button
              onClick={() => setHazardFilter('all')}
              className={`px-3 py-1.5 text-sm transition-colors ${hazardFilter === 'all' ? 'bg-primary text-white' : 'text-muted-foreground bg-transparent hover:bg-white/5'}`}
            >
              All ({allAsteroids.length})
            </button>
            <button
              onClick={() => setHazardFilter('hazardous')}
              className={`border-l border-white/10 px-3 py-1.5 text-sm transition-colors ${hazardFilter === 'hazardous' ? 'bg-red-500/80 text-white' : 'text-muted-foreground bg-transparent hover:bg-white/5'}`}
            >
              Hazardous ({hazardousCount})
            </button>
            <button
              onClick={() => setHazardFilter('safe')}
              className={`border-l border-white/10 px-3 py-1.5 text-sm transition-colors ${hazardFilter === 'safe' ? 'bg-green-500/80 text-white' : 'text-muted-foreground bg-transparent hover:bg-white/5'}`}
            >
              Safe ({allAsteroids.length - hazardousCount})
            </button>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 hover:bg-white/5"
              >
                <Ruler className="mr-1 h-4 w-4" />
                {sizeFilter === 'all'
                  ? 'All Sizes'
                  : sizeFilter.charAt(0).toUpperCase() + sizeFilter.slice(1)}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-surface/95 w-40 border-white/10 p-1 backdrop-blur-xl">
              <button
                onClick={() => setSizeFilter('all')}
                className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-white/5 ${sizeFilter === 'all' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                All Sizes
              </button>
              <button
                onClick={() => setSizeFilter('small')}
                className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-white/5 ${sizeFilter === 'small' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Small (&lt;100m)
              </button>
              <button
                onClick={() => setSizeFilter('medium')}
                className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-white/5 ${sizeFilter === 'medium' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Medium (100-500m)
              </button>
              <button
                onClick={() => setSizeFilter('large')}
                className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-white/5 ${sizeFilter === 'large' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Large (&gt;500m)
              </button>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          <span className="text-muted-foreground text-sm">
            Showing {getFilteredCount()} of {allAsteroids.length}
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 hover:bg-white/5"
              >
                <ArrowUpDown className="mr-1 h-4 w-4" />
                {sortBy === 'distance'
                  ? 'Closest'
                  : sortBy === 'velocity'
                    ? 'Fastest'
                    : 'Largest'}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-surface/95 w-40 border-white/10 p-1 backdrop-blur-xl">
              <button
                onClick={() => setSortBy('distance')}
                className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-white/5 ${sortBy === 'distance' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Closest
              </button>
              <button
                onClick={() => setSortBy('velocity')}
                className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-white/5 ${sortBy === 'velocity' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Fastest
              </button>
              <button
                onClick={() => setSortBy('size')}
                className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-white/5 ${sortBy === 'size' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Largest
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {sortedDates.map((date) => {
        const filtered = filterAsteroids(data.near_earth_objects[date]);
        if (filtered.length === 0) return null;
        return (
          <div key={date} className="mb-8">
            <h2 className="text-soft-white mb-4 flex items-center gap-2 text-xl font-semibold">
              <span className="bg-primary h-2 w-2 rounded-full" />
              {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              <span className="text-muted-foreground text-sm font-normal">
                ({filtered.length} objects)
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((asteroid) => (
                <AsteroidCard key={asteroid.id} asteroid={asteroid} />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
