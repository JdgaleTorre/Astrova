// src/routes/apod.tsx
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getApod, type ApodParams } from '../services/nasa';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import HeaderComponent from '../components/headerComponent';
import { Loading } from '../components/ui/loading';
import { ErrorDisplay } from '../components/ui/error';
import ApodCard from '../components/apodCard';

export const Route = createFileRoute('/apod')({
  component: ApodPage,
});

export function ApodPage() {
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>({
    from: new Date(),
  });

  const params: ApodParams = {
    start_date: selectedDate?.from?.toISOString().split('T')[0],
    end_date:
      selectedDate?.to === undefined
        ? selectedDate?.from?.toISOString().split('T')[0]
        : selectedDate?.to.toISOString().split('T')[0],
  };

  const {
    data: apodData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['apod', selectedDate?.from, selectedDate?.to],
    queryFn: () => getApod(params),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="flex min-h-screen flex-col pt-16">
      <HeaderComponent
        title="Astronomy Picture Of the Day"
        description={`Discover the cosmos through NASA' s daily featured images`}
        showCalendarFilter
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        disableDates={(date: Date) =>
          date > new Date() || date < new Date('1995-06-16')
        }
        calendarMode="range"
      />

      {/* Content */}
      <div className="container mx-auto max-w-7xl justify-center px-4 py-12 md:pt-48">
        <div className="mx-auto grid max-w-6xl gap-8">
          {error ? (
            <ErrorDisplay error={error} />
          ) : (
            apodData?.map((data) => <ApodCard {...data} />)
          )}
        </div>
      </div>
    </div>
  );
}
