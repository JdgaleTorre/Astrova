import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getApod, type ApodParams } from '../../services/nasa';
import HeaderComponent from '../../components/headerComponent';
import { Loading } from '../../components/ui/loading';
import { ErrorDisplay } from '../../components/ui/error';
import ApodCard from '../../components/apodCard';

export const Route = createFileRoute('/apod/$date')({
  component: ApodDatePage,
});

export function ApodDatePage() {
  const { date } = Route.useParams();

  const params: ApodParams = {
    date: date,
  };

  const {
    data: apodData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['apod', date],
    queryFn: () => getApod(params),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="flex min-h-screen flex-col pt-16">
      <HeaderComponent
        title="Astronomy Picture Of the Day"
        description={`Discover the cosmos - ${date}`}
      />
      <div className="container mx-auto max-w-7xl justify-center px-4 py-12 md:pt-48">
        <div className="mx-auto grid max-w-6xl gap-8">
          {error ? (
            <ErrorDisplay error={error} />
          ) : (
            apodData?.map((data) => (
              <div key={data.title}>
                <ApodCard {...data} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}