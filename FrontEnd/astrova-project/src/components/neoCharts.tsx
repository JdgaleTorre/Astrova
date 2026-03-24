import { AlertTriangle, Calculator, Orbit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { axisClasses, LineChart, PieChart, ScatterChart } from '@mui/x-charts';
import type { NeoFeedResponse } from '../services/nasa';
import { format } from 'date-fns';

export default function NeoCharts(data: NeoFeedResponse) {
  const sortedDates = data ? Object.keys(data.near_earth_objects).sort() : [];
  const allAsteroids = data
    ? Object.values(data.near_earth_objects).flat()
    : [];
  const hazardousCount = allAsteroids.filter(
    (a) => a.is_potentially_hazardous_asteroid,
  ).length;
  const chartData = data
    ? Object.entries(data.near_earth_objects).flatMap(([date, neos]) =>
        neos.map((neo) => ({
          ...neo,
          date: new Date(date),
        })),
      )
    : [];

  const normalizedData = chartData.map((neo) => {
    const approach = neo.close_approach_data?.[0];

    return {
      date: neo.date,
      size: neo.estimated_diameter.kilometers.estimated_diameter_max,
      distance: Number(approach?.miss_distance.kilometers ?? 0),
      velocity: Number(approach?.relative_velocity.kilometers_per_hour ?? 0),
      hazardous: neo.is_potentially_hazardous_asteroid,
    };
  });

  return (
    <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      <Card className="from-cyan/5 border-cyan/10 mt-6 bg-linear-to-br to-transparent">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Safe vs Hazardous
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <PieChart
            series={[
              {
                data: [
                  {
                    id: 'Safe',
                    value: data.element_count - hazardousCount,
                    label: 'Safe',
                    color: '#22c55e',
                  },
                  {
                    id: 'Hazardous',
                    value: hazardousCount,
                    label: 'Hazardous',
                    color: '#ef4444',
                  },
                ],
                innerRadius: 30,
                outerRadius: 80,
                paddingAngle: 2,
              },
            ]}
            width={300}
            height={200}
            slotProps={{
              legend: {
                sx: {
                  fontSize: 14,
                  color: 'white',
                },
              },
            }}
          />
        </CardContent>
      </Card>
      <Card className="from-cyan/5 border-cyan/10 mt-6 bg-linear-to-br to-transparent">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Objects by Date</CardTitle>
          <Calculator className="text-cyan h-4 w-4" />
        </CardHeader>
        <CardContent>
          <LineChart
            xAxis={[
              {
                scaleType: 'band',
                data: sortedDates.map((d) => format(new Date(d), 'MMM d')),
                label: 'Date',
              },
            ]}
            yAxis={[{ label: 'Object Count' }]}
            series={[
              {
                data: sortedDates.map((d) => data.near_earth_objects[d].length),
                label: 'Objects',
                color: '#06b6d4',
              },
            ]}
            width={500}
            height={200}
            grid={{ horizontal: true }}
            slotProps={{
              legend: {
                sx: {
                  fontSize: 14,
                  color: 'white',
                },
              },
            }}
            sx={() => ({
              [`.${axisClasses.root}`]: {
                [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                  stroke: '#FFF',
                  strokeWidth: 2,
                },
                [`.${axisClasses.tickLabel}`]: {
                  fill: '#FFF',
                },
                [`.${axisClasses.label}`]: {
                  fill: '#FFF',
                },
              },
            })}
          />
        </CardContent>
      </Card>
      <Card className="from-cyan/5 border-cyan/10 mt-6 bg-linear-to-br to-transparent md:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Size vs Distance (km)
          </CardTitle>
          <Orbit className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <ScatterChart
            xAxis={[
              {
                label: 'Size (km)',
                scaleType: 'linear',
                valueFormatter: (v) => (v ? `${v.toFixed(2)} km` : ''),
              },
            ]}
            yAxis={[
              {
                label: 'Distance (km)',
                scaleType: 'linear',
                valueFormatter: (v) =>
                  v ? `${(v / 1000000).toFixed(1)}M km` : '',
              },
            ]}
            series={[
              {
                data: normalizedData
                  .filter((n) => n.size > 0 && n.distance > 0)
                  .map((n) => ({
                    x: n.size,
                    y: n.distance,
                    fill: n.hazardous ? '#ef4444' : '#22c55e',
                  })),
                label: 'Asteroids',
              },
            ]}
            width={700}
            height={300}
            grid={{ horizontal: true }}
            slotProps={{
              legend: {
                sx: {
                  fontSize: 14,
                  color: 'white',
                },
              },
            }}
            sx={() => ({
              [`.${axisClasses.root}`]: {
                [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                  stroke: '#FFF',
                  strokeWidth: 2,
                },
                [`.${axisClasses.tickLabel}`]: {
                  fill: '#FFF',
                },
                [`.${axisClasses.label}`]: {
                  fill: '#FFF',
                },
              },
            })}
          />
        </CardContent>
      </Card>
    </div>
  );
}
