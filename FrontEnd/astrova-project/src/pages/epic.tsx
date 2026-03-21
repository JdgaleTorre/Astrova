import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Loading } from '../components/ui/loading'
import { useQuery } from '@tanstack/react-query'
import { getEpicByDate, getEpicDates, type EpicType } from '../services/nasa'
import { format } from 'date-fns';
import { EpicCarousel } from '../components/epicCarousel'
import { ErrorDisplay } from '../components/ui/error'
import HeaderComponent from '../components/headerComponent'

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
        <HeaderComponent
          title='Earth Polychromatic Imaging Camera'
          description='Full-disc Earth imagery from the DSCOVR spacecraft'
          showCalendarFilter
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          disableDates={(date) => date > new Date() || date < new Date('1995-06-16')}
          calendarMode='single' />


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
      <HeaderComponent
        title='Earth Polychromatic Imaging Camera'
        description='Full-disc Earth imagery from the DSCOVR spacecraft'
        showCalendarFilter
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        disableDates={(date) => date > new Date() || date < new Date('1995-06-16')}
        calendarMode='single' />

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