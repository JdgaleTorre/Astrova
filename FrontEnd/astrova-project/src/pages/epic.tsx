import { createFileRoute } from '@tanstack/react-router'
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'
import { Button } from '../components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../components/ui/calendar'
import { useState, useEffect } from 'react'
import { Loading } from '../components/ui/loading'
import { useQuery } from '@tanstack/react-query'
import { getEpicByDate, getEpicDates, type EpicType } from '../services/nasa'
import { format } from 'date-fns';
import { EpicCarousel } from '../components/epicCarousel'

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
  // Reset index when date changes without useEffect
  const [prevDate, setPrevDate] = useState(selectedDate);
  if (prevDate !== selectedDate) {
    setPrevDate(selectedDate);
    setSelectedIndex(0);
  }

  const { data, isLoading } = useQuery({
    queryKey: ['epic', selectedDate],
    queryFn: () => getEpicByDate(selectedDate?.toISOString().split('T')[0] || '', type),
  })

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
      {data && (
        <EpicCarousel
          images={data}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          dateStr={dateStr}
          type={type}
        />
      )}
    </div>
  </div>)
}
