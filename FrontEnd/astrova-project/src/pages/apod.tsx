// src/routes/apod.tsx
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getApod, type ApodParams } from '../services/nasa';
import { Button } from '../components/ui/button';
import {
  Bookmark,
  Calendar as CalendarIcon,
  Download,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Loading } from '../components/ui/loading';
import { ErrorDisplay } from '../components/ui/error';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import HeaderComponent from '../components/headerComponent';

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
    <div className="min-h-screen flex flex-col pt-16">
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
      <div className="container max-w-7xl mx-auto md:pt-48 py-12 px-4 justify-center">
        <div className="grid gap-8 max-w-6xl mx-auto">
          {error ? (
            <ErrorDisplay error={error} />
          ) : (
            apodData?.map((data) => (
              <div key={data?.date}>
                {/* Hero Image */}
                <div className="relative overflow-hidden rounded-2xl group mb-6">
                  {data?.media_type === 'image' ? (
                    <div className="relative">
                      <img
                        src={data?.url}
                        alt={data?.title}
                        className="w-full h-auto min-h-100 md:min-h-150 object-cover"
                      />
                      {/* Dark overlay gradient */}
                      <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent opacity-80" />

                      {/* Title overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                        <div className="flex items-center gap-2 text-cyan text-sm mb-3">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{data?.date}</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-soft-white mb-4">
                          {data?.title}
                        </h2>
                        {data?.copyright && (
                          <p className="text-sm text-muted-foreground">
                            © {data?.copyright}
                          </p>
                        )}
                      </div>

                      {/* Download button on hover */}

                      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-cyan/90 hover:bg-cyan text-background backdrop-blur-sm shadow-lg group/btn gap-0"
                            asChild
                          >
                            <a
                              href={data?.hdurl || data?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="overflow-hidden"
                            >
                              <Download className="h-4 w-4" />
                              <span className="ml-0 w-0 translate-x-110 group-hover/btn:w-auto group-hover/btn:ml-2 group-hover/btn:translate-x-0 transition-all duration-600 ease-in-out">
                                HD Image
                              </span>
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            className="bg-cyan/90 hover:bg-cyan text-background backdrop-blur-sm shadow-lg group/btn gap-0 overflow-hidden"
                          >
                            <Bookmark className="h-4 w-4" />
                            <span className="ml-0 w-0 translate-x-110 group-hover/btn:w-auto group-hover/btn:ml-2 group-hover/btn:translate-x-0 transition-all duration-600 ease-in-out">
                              Save
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-background rounded-2xl overflow-hidden">
                      <video
                        src={data?.url}
                        title={data?.title}
                        className="w-full aspect-video rounded-xl"
                        controls
                        autoPlay
                        loop
                        muted
                      />
                    </div>
                  )}
                </div>
                {/* Description Panel */}
                <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                  <CardHeader>
                    <div
                      className="flex items-center justify-between cursor-pointer group"
                      // onClick={() => setShowDescription(prev => ({ ...prev, [apod.date]: !prev[apod.date] }))}
                    >
                      <CardTitle className="text-xl text-soft-white group-hover:text-cyan transition-colors">
                        Description
                      </CardTitle>
                      {/* <ChevronDown
                                            className={`h-5 w-5 text-cyan transition-transform ${showDescription[apod.date] ? 'rotate-180' : ''
                                                }`}
                                        /> */}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {data.explanation}
                    </p>
                    <div className="flex gap-3 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-cyan/20 hover:bg-cyan/10 hover:border-cyan/40"
                      >
                        <a
                          href={data.hdurl || data.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Original
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-cyan/5 to-transparent border-cyan/10 mt-6">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan/20 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-cyan" />
                      </div>
                      <CardTitle className="text-cyan text-sm">
                        AI Insight
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {data.ai_summary}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
