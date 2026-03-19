import { createFileRoute } from '@tanstack/react-router'
import { CalendarIcon, AlertTriangle, Orbit, Timer, Ruler, ExternalLink, Rocket, Calculator, ChevronDown, ArrowUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { getAsteroids, type NeoParams, type NeoAsteroid } from '../services/nasa';
import { useQuery } from '@tanstack/react-query';
import { Loading } from '../components/ui/loading';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

type HazardFilter = 'all' | 'hazardous' | 'safe';
type SizeFilter = 'all' | 'small' | 'medium' | 'large';
type SortBy = 'distance' | 'velocity' | 'size';


export const Route = createFileRoute('/neo')({
  component: RouteComponent,
})

function AsteroidCard({ asteroid }: { asteroid: NeoAsteroid }) {
  const approach = asteroid.close_approach_data[0];
  const diameter = asteroid.estimated_diameter.meters;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-white/5 hover:border-primary/30 transition-colors ">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg text-soft-white">{asteroid.name}</CardTitle>
          {asteroid.is_potentially_hazardous_asteroid && (
            <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">
              <AlertTriangle className="h-3 w-3" />
              Hazardous
            </span>
          )}
        </div>
        <a
          href={asteroid.nasa_jpl_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-cyan hover:text-cyan/80 flex items-center gap-1 transition-colors"
        >
          NASA JPL <ExternalLink className="h-3 w-3" />
        </a>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Ruler className="h-4 w-4 text-primary" />
            <span>Size</span>
          </div>
          <span className="text-soft-white text-right">
            {diameter.estimated_diameter_min.toFixed(0)} - {diameter.estimated_diameter_max.toFixed(0)} m
          </span>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Rocket className="h-4 w-4 text-stellar-orange" />
            <span>Velocity</span>
          </div>
          <span className="text-soft-white text-right">
            {parseFloat(approach.relative_velocity.kilometers_per_hour).toLocaleString()} km/h
          </span>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Orbit className="h-4 w-4 text-secondary" />
            <span>Miss Distance</span>
          </div>
          <span className="text-soft-white text-right">
            {parseFloat(approach.miss_distance.lunar).toFixed(2)} lunar
          </span>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Timer className="h-4 w-4 text-cyan" />
            <span>Approach</span>
          </div>
          <span className="text-soft-white text-right">
            {format(new Date(approach.close_approach_date), 'MMM d, yyyy')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function RouteComponent() {
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>({ from: new Date() });
  const [hazardFilter, setHazardFilter] = useState<HazardFilter>('all');
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('distance');

  const params: NeoParams = {
    start_date: selectedDate?.from?.toISOString().split('T')[0],
    end_date: selectedDate?.to === undefined ? selectedDate?.from?.toISOString().split('T')[0] : selectedDate?.to.toISOString().split('T')[0]
  }

  const { data, isLoading } = useQuery({
    queryKey: ['neo', selectedDate?.from, selectedDate?.to],
    queryFn: () => getAsteroids(params),
  })

  if (isLoading) return <Loading />

  const sortedDates = data ? Object.keys(data.near_earth_objects).sort() : [];
  const allAsteroids = data ? Object.values(data.near_earth_objects).flat() : [];
  const hazardousCount = allAsteroids.filter(a => a.is_potentially_hazardous_asteroid).length;

  const filterAsteroids = (asteroids: NeoAsteroid[]) => {
    return asteroids
      .filter(a => {
        if (hazardFilter === 'hazardous' && !a.is_potentially_hazardous_asteroid) return false;
        if (hazardFilter === 'safe' && a.is_potentially_hazardous_asteroid) return false;

        const avgDiameter = (a.estimated_diameter.meters.estimated_diameter_min + a.estimated_diameter.meters.estimated_diameter_max) / 2;
        if (sizeFilter === 'small' && avgDiameter >= 100) return false;
        if (sizeFilter === 'medium' && (avgDiameter < 100 || avgDiameter > 500)) return false;
        if (sizeFilter === 'large' && avgDiameter <= 500) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') {
          return a.close_approach_data[0].miss_distance.lunar.localeCompare(b.close_approach_data[0].miss_distance.lunar);
        }
        if (sortBy === 'velocity') {
          return parseFloat(b.close_approach_data[0].relative_velocity.kilometers_per_hour) - parseFloat(a.close_approach_data[0].relative_velocity.kilometers_per_hour);
        }
        const sizeA = (a.estimated_diameter.meters.estimated_diameter_min + a.estimated_diameter.meters.estimated_diameter_max) / 2;
        const sizeB = (b.estimated_diameter.meters.estimated_diameter_min + b.estimated_diameter.meters.estimated_diameter_max) / 2;
        return sizeB - sizeA;
      });
  };

  const getFilteredCount = () => filterAsteroids(allAsteroids).length;

  return (
    <div className="min-h-screen flex flex-col pt-16 relative">
      <div className="fixed w-full z-50 border-b border-white/5 bg-surface/30 backdrop-blur-sm">
        <div className="w-full py-8 px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                <span className="text-primary">N</span>
                <span className="text-soft-white">ear </span>
                <span className="text-primary">E</span>
                <span className="text-soft-white">arth </span>
                <span className="text-primary">O</span>
                <span className="text-soft-white">bjects</span>
              </h1>
              <p className="text-muted-foreground">
                Track asteroids approaching Earth
              </p>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto border-cyan/20 hover:bg-cyan/10 hover:border-cyan/40 backdrop-blur-sm"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-cyan" />
                  {selectedDate?.from
                    && `${format(selectedDate.from, 'PPP')}${selectedDate?.to ? ` → ${format(selectedDate.to, 'PPP')}` : ``}`
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-surface/95 backdrop-blur-xl border-white/10" align="end">
                <Calendar
                  mode="range"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date > new Date() || date < new Date('1995-06-16')}
                  navLayout='around'
                  captionLayout="dropdown"
                  min={1}
                  max={5}
                  footer={<p className="text-center text-sm text-muted-foreground pt-3 border-t border-white/5 mt-3">
                    {selectedDate?.from && selectedDate?.to
                      ? `${Math.ceil((selectedDate.to.getTime() - selectedDate.from.getTime()) / (1000 * 60 * 60 * 24))} days selected`
                      : 'Pick a range up to 6 days.'
                    }
                  </p>}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto py-12  pt-48 px-4">
        {data && (
          <>
            <div className="flex-wrap gap-4 mb-8">
              <div className="grid gap-6 md:grid-cols-4 mb-8">
                <Card className="border-l-4 border-l-primary bg-linear-to-br from-primary/5 to-transparent hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Objects</CardTitle>
                    <Orbit className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{data.element_count}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tracked today
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-400 bg-linear-to-br from-red-400/5 to-transparent hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Potentially Hazardous</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-400">{hazardousCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Require monitoring
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 bg-linear-to-br from-green-500/5 to-transparent hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Safe Objects</CardTitle>
                    <Orbit className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">{data.element_count - hazardousCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      No immediate threat
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500 bg-linear-to-br from-green-500/5 to-transparent hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Days Tracked</CardTitle>
                    <Calculator className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">{sortedDates.length}</div>

                  </CardContent>
                </Card>

              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-card/30 backdrop-blur-sm rounded-lg border border-white/5 z-50">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Filter:</span>
                  <div className="flex rounded-md overflow-hidden border border-white/10">
                    <button
                      onClick={() => setHazardFilter('all')}
                      className={`px-3 py-1.5 text-sm transition-colors ${hazardFilter === 'all' ? 'bg-primary text-white' : 'bg-transparent text-muted-foreground hover:bg-white/5'}`}
                    >
                      All ({allAsteroids.length})
                    </button>
                    <button
                      onClick={() => setHazardFilter('hazardous')}
                      className={`px-3 py-1.5 text-sm transition-colors border-l border-white/10 ${hazardFilter === 'hazardous' ? 'bg-red-500/80 text-white' : 'bg-transparent text-muted-foreground hover:bg-white/5'}`}
                    >
                      Hazardous ({hazardousCount})
                    </button>
                    <button
                      onClick={() => setHazardFilter('safe')}
                      className={`px-3 py-1.5 text-sm transition-colors border-l border-white/10 ${hazardFilter === 'safe' ? 'bg-green-500/80 text-white' : 'bg-transparent text-muted-foreground hover:bg-white/5'}`}
                    >
                      Safe ({allAsteroids.length - hazardousCount})
                    </button>
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                        <Ruler className="h-4 w-4 mr-1" />
                        {sizeFilter === 'all' ? 'All Sizes' : sizeFilter.charAt(0).toUpperCase() + sizeFilter.slice(1)}
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-1 bg-surface/95 backdrop-blur-xl border-white/10">
                      <button onClick={() => setSizeFilter('all')} className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-white/5 ${sizeFilter === 'all' ? 'text-primary' : 'text-muted-foreground'}`}>All Sizes</button>
                      <button onClick={() => setSizeFilter('small')} className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-white/5 ${sizeFilter === 'small' ? 'text-primary' : 'text-muted-foreground'}`}>Small (&lt;100m)</button>
                      <button onClick={() => setSizeFilter('medium')} className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-white/5 ${sizeFilter === 'medium' ? 'text-primary' : 'text-muted-foreground'}`}>Medium (100-500m)</button>
                      <button onClick={() => setSizeFilter('large')} className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-white/5 ${sizeFilter === 'large' ? 'text-primary' : 'text-muted-foreground'}`}>Large (&gt;500m)</button>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                  <span className="text-sm text-muted-foreground">Showing {getFilteredCount()} of {allAsteroids.length}</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                        <ArrowUpDown className="h-4 w-4 mr-1" />
                        {sortBy === 'distance' ? 'Closest' : sortBy === 'velocity' ? 'Fastest' : 'Largest'}
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-1 bg-surface/95 backdrop-blur-xl border-white/10">
                      <button onClick={() => setSortBy('distance')} className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-white/5 ${sortBy === 'distance' ? 'text-primary' : 'text-muted-foreground'}`}>Closest</button>
                      <button onClick={() => setSortBy('velocity')} className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-white/5 ${sortBy === 'velocity' ? 'text-primary' : 'text-muted-foreground'}`}>Fastest</button>
                      <button onClick={() => setSortBy('size')} className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-white/5 ${sortBy === 'size' ? 'text-primary' : 'text-muted-foreground'}`}>Largest</button>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {sortedDates.map(date => {
                const filtered = filterAsteroids(data.near_earth_objects[date]);
                if (filtered.length === 0) return null;
                return (
                  <div key={date} className="mb-8 ">
                    <h2 className="text-xl font-semibold text-soft-white mb-4 flex items-center gap-2 ">
                      <span className="w-2 h-2 bg-primary rounded-full" />
                      {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                      <span className="text-sm text-muted-foreground font-normal">
                        ({filtered.length} objects)
                      </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filtered.map(asteroid => (
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