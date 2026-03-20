import { createFileRoute } from '@tanstack/react-router'
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'
import { Button } from '../components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../components/ui/calendar'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Loading } from '../components/ui/loading'
import { useQuery } from '@tanstack/react-query'
import { getEpicDates, type EpicType } from '../services/nasa'
import { format } from 'date-fns';

export const Route = createFileRoute('/epic')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>({ from: new Date() });
  const type: EpicType = 'natural';


  const { data, isLoading } = useQuery({
    queryKey: ['neo', selectedDate?.from, selectedDate?.to],
    queryFn: () => getEpicDates(type),
  })
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

    <div className="container max-w-7xl mx-auto py-12  md:pt-48 px-4">

    </div>
  </div>)
}
