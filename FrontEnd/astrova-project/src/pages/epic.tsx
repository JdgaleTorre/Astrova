import { createFileRoute } from '@tanstack/react-router'
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'
import { Button } from '../components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../components/ui/calendar'
import { useState } from 'react'
import { Loading } from '../components/ui/loading'
import { useQuery } from '@tanstack/react-query'
import { getEpicByDate, getEpicDates, type EpicType } from '../services/nasa'
import { format } from 'date-fns';
import { EpicCarousel } from '../components/epicCarousel'
import { ErrorDisplay } from '../components/ui/error'

export const Route = createFileRoute('/epic')({
  component: RouteComponent,
})

function RouteComponent() {
  const type: EpicType = 'natural';


  const { data: datesAvailable, isLoading, error } = useQuery({
    queryKey: ['epic-dates', type],
    queryFn: () => getEpicDates(type),
  });

  if (isLoading) return <Loading />;

  // Only render the main view once we have the default date from the API
  if (datesAvailable)
    return <EpicView initialDate={new Date(datesAvailable[0].date)} type={type} />;

  if (error)
    return <ErrorDisplay error={error} />
}

function EpicView({ initialDate, type }: { initialDate: Date, type: EpicType }) {

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);


  const { data, isLoading: isImagesLoading } = useQuery({
    queryKey: ['epic-images', selectedDate, type],
    queryFn: () => getEpicByDate(selectedDate.toISOString().split('T')[0], type),
  });

  // Update dateStr for the carousel
  const dateStr = format(selectedDate, 'yyyy/MM/dd');

  if (isImagesLoading) return <Loading />;

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen flex flex-col pt-16 relative">
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
                  <span className="text-soft-white">maging </span>
                  <span className="text-primary">C</span>
                  <span className="text-soft-white">amera</span>
                </h1>
                <p className="text-muted-foreground">
                  Full-disc Earth imagery from the DSCOVR spacecraft
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

        <div className="container max-w-7xl mx-auto py-12 md:pt-48 px-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-muted-foreground">
              No pictures available for {format(selectedDate, 'MMMM d, yyyy')}
            </p>
            <p className="text-sm text-muted-foreground/60 mt-2">
              Try selecting a different date
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-16 relative">
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
                <span className="text-soft-white">maging </span>
                <span className="text-primary">C</span>
                <span className="text-soft-white">amera</span>
              </h1>
              <p className="text-muted-foreground">
                Full-disc Earth imagery from the DSCOVR spacecraft
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
        <EpicCarousel
          key={dateStr}
          images={data}
          dateStr={dateStr}
          type={type}
        />
      </div>
    </div>
  )
}