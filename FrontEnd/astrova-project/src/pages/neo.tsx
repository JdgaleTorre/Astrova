import { createFileRoute } from '@tanstack/react-router';
import {
  AlertTriangle,
  Orbit,
  Ruler,
  Calculator,
  ChevronDown,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import {
  getAsteroids,
  type NeoParams,
  type NeoAsteroid,
} from '../services/nasa';
import { useQuery } from '@tanstack/react-query';
import { Loading } from '../components/ui/loading';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import HeaderComponent from '../components/headerComponent';
import AsteroidCard from '../components/astroidCard';

type HazardFilter = 'all' | 'hazardous' | 'safe';
type SizeFilter = 'all' | 'small' | 'medium' | 'large';
type SortBy = 'distance' | 'velocity' | 'size';

export const Route = createFileRoute('/neo')({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>({
    from: new Date(),
  });
  const [hazardFilter, setHazardFilter] = useState<HazardFilter>('all');
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('distance');

  const params: NeoParams = {
    start_date: selectedDate?.from?.toISOString().split('T')[0],
    end_date:
      selectedDate?.to === undefined
        ? selectedDate?.from?.toISOString().split('T')[0]
        : selectedDate?.to.toISOString().split('T')[0],
  };

  const { data, isLoading } = useQuery({
    queryKey: ['neo', selectedDate?.from, selectedDate?.to],
    queryFn: () => getAsteroids(params),
  });

  if (isLoading) return <Loading />;

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
    <div className="relative flex min-h-screen flex-col pt-16">
      <HeaderComponent
        title="Near Earth Objects"
        description="Track asteroids approaching Earth"
        showCalendarFilter
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        disableDates={(date) =>
          date > new Date() || date < new Date('1995-06-16')
        }
        calendarMode="range"
      />

      <div className="container mx-auto max-w-7xl px-4 py-12 md:pt-48">
        {data && (
          <>
            <div className="mb-8 flex-wrap gap-4">
              <div className="mb-8 grid gap-6 md:grid-cols-4">
                <Card className="border-l-primary from-primary/5 border-l-4 bg-linear-to-br to-transparent transition-shadow hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Objects
                    </CardTitle>
                    <Orbit className="text-primary h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-primary text-2xl font-bold">
                      {data.element_count}
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Tracked today
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-400 bg-linear-to-br from-red-400/5 to-transparent transition-shadow hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Potentially Hazardous
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-400">
                      {hazardousCount}
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Require monitoring
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 bg-linear-to-br from-green-500/5 to-transparent transition-shadow hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Safe Objects
                    </CardTitle>
                    <Orbit className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">
                      {data.element_count - hazardousCount}
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      No immediate threat
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500 bg-linear-to-br from-green-500/5 to-transparent transition-shadow hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Days Tracked
                    </CardTitle>
                    <Calculator className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">
                      {sortedDates.length}
                    </div>
                  </CardContent>
                </Card>

                <Card className="from-cyan/5 border-cyan/10 mt-6 bg-linear-to-br to-transparent md:col-span-4">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="bg-cyan/20 flex h-8 w-8 items-center justify-center rounded-lg">
                        <Sparkles className="text-cyan h-4 w-4" />
                      </div>
                      <CardTitle className="text-cyan text-sm">
                        AI Insight
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {data.aiSummary}
                    </p>
                  </CardContent>
                </Card>
              </div>

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
                          : sizeFilter.charAt(0).toUpperCase() +
                            sizeFilter.slice(1)}
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
