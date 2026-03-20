import { createFileRoute } from '@tanstack/react-router'
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'
import { Button } from '../components/ui/button'
import { CalendarIcon, Download, Globe, MapPin, Satellite, ChevronLeft, ChevronRight } from 'lucide-react'
import { Calendar } from '../components/ui/calendar'
import { useState, useEffect } from 'react'
import { Loading } from '../components/ui/loading'
import { useQuery } from '@tanstack/react-query'
import { getEpicByDate, getEpicDates, type EpicType } from '../services/nasa'
import { format } from 'date-fns';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export const Route = createFileRoute('/epic')({
  component: RouteComponent,
})

function RouteComponent() {
  const type: EpicType = 'natural';
  const { data: datesAvailabe } = useQuery({
    queryKey: ['epic', type],
    queryFn: () => getEpicDates(type),
  })

  const [selectedDate, setSelectedDate] = useState<Date>(new Date(datesAvailabe?.[0].date || new Date()));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dateStr = format(selectedDate, 'yyyy/MM/dd');

  const { data, isLoading } = useQuery({
    queryKey: ['epic', selectedDate],
    queryFn: () => getEpicByDate(selectedDate?.toISOString().split('T')[0] || '', type),
  })

  useEffect(() => {
    setSelectedIndex(0);
  }, [selectedDate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelectedIndex(prev => Math.max(0, prev - 1));
      }
      if (e.key === 'ArrowRight') {
        setSelectedIndex(prev => Math.min((data?.length || 1) - 1, prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data?.length]);
  if (isLoading) return <Loading />

  return (<div className="min-h-screen flex flex-col pt-16 relative">
    <div className="md:fixed w-full z-50 border-b border-white/5 bg-surface/30 backdrop-blur-sm">
      <div className="w-full py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-primary">E</span>
              <span className="text-soft-white">arth </span>
              <span className="text-primary">P</span>
              <span className="text-soft-white">olychromatic </span>
              <span className="text-primary">I</span>
              <span className="text-soft-white">maging</span>
              <span className="text-primary">C</span>
              <span className="text-soft-white">amera</span>
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
                {format(selectedDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-surface/95 backdrop-blur-xl border-white/10" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date > new Date() || date < new Date('1995-06-16')}
                navLayout='around'
                captionLayout="dropdown"
                required
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>

    <div className="container max-w-7xl mx-auto py-12 md:pt-48 px-4">
      <div className="relative overflow-hidden rounded-2xl group mb-6">

        {data && data[selectedIndex] &&
          <Card key={data[selectedIndex].identifier} className="overflow-hidden border-space-cyan/20 hover:shadow-2xl hover:shadow-space-cyan/20 transition-all">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="relative group lg:col-span-2">
                <img
                  src={`https://epic.gsfc.nasa.gov/archive/${type}/${dateStr}/png/${data[selectedIndex]?.image}.png`}
                  alt={data[selectedIndex].caption}
                  className="w-full h-full object-cover min-h-100"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    className="bg-cyan/90 hover:bg-cyan text-background backdrop-blur-sm shadow-lg"
                    asChild
                  >
                    <a href={`https://epic.gsfc.nasa.gov/archive/${type}/${dateStr}/png/${data[selectedIndex]?.image}.png`} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      HD Image
                    </a>
                  </Button>
                </div>
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/50 hover:bg-background/70 backdrop-blur-sm border-white/20"
                    onClick={() => setSelectedIndex(prev => Math.max(0, prev - 1))}
                    disabled={selectedIndex === 0}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span className="bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-soft-white border border-white/20">
                    Image {selectedIndex + 1} of {data.length}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/50 hover:bg-background/70 backdrop-blur-sm border-white/20"
                    onClick={() => setSelectedIndex(prev => Math.min(data.length - 1, prev + 1))}
                    disabled={selectedIndex === data.length - 1}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Satellite className="h-4 w-4 text-space-cyan" />
                  <span className="text-sm font-medium text-space-cyan">
                    {new Date(data[selectedIndex].date).toLocaleString()}
                  </span>
                </div>
                <CardTitle className="text-2xl mb-3">{data[selectedIndex].caption}</CardTitle>
                <CardDescription className="text-base">
                  Image captured by NASA's EPIC camera aboard the DSCOVR spacecraft,
                  positioned at the Sun-Earth Lagrange point L1, approximately 1.5 million
                  kilometers from Earth.
                </CardDescription>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Centroid Coordinates</p>
                      <p className="text-sm text-muted-foreground">
                        Lat: {data[selectedIndex].centroid_coordinates.lat.toFixed(2)}° •
                        Lon: {data[selectedIndex].centroid_coordinates.lon.toFixed(2)}°
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-space-cyan mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">DSCOVR Position</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        X: {(data[selectedIndex].dscovr_j2000_position.x / 1000000).toFixed(2)}M km<br />
                        Y: {(data[selectedIndex].dscovr_j2000_position.y / 1000000).toFixed(2)}M km<br />
                        Z: {(data[selectedIndex].dscovr_j2000_position.z / 1000000).toFixed(2)}M km
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t pb-4">
                    <p className="text-xs text-muted-foreground">
                      Version: {data[selectedIndex].version} • Identifier: {data[selectedIndex].identifier}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </div>
          </Card>
        }
      </div>

      {data && data.length > 1 && (
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-muted-foreground">All images from this date:</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {data.map((image, index) => (
              <button
                key={image.identifier}
                onClick={() => setSelectedIndex(index)}
                className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                  index === selectedIndex
                    ? 'ring-2 ring-cyan shadow-lg shadow-cyan/20'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={`https://epic.gsfc.nasa.gov/archive/${type}/${dateStr}/thumbs/${image.image}.jpg`}
                  alt={image.caption}
                  className="w-32 h-24 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}


    </div>
  </div>)
}
