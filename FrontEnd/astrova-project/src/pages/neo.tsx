import { createFileRoute } from '@tanstack/react-router';
import { AlertTriangle, Orbit, Calculator, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { getAsteroids, type NeoParams } from '../services/nasa';
import { useQuery } from '@tanstack/react-query';
import { Loading } from '../components/ui/loading';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import HeaderComponent from '../components/headerComponent';
import NeoCharts from '../components/neoCharts';
import NeoRawData from '../components/neoRawData';

export const Route = createFileRoute('/neo')({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>({
    from: new Date(),
  });

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
  const allAsteroids = data
    ? Object.values(data.near_earth_objects).flat()
    : [];
  const hazardousCount = allAsteroids.filter(
    (a) => a.is_potentially_hazardous_asteroid,
  ).length;
  const sortedDates = data ? Object.keys(data.near_earth_objects).sort() : [];

  if (isLoading) return <Loading />;

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

              <NeoCharts {...data} />

              <NeoRawData {...data} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
