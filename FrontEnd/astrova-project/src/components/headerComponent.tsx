import { CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import type { DateRange } from 'react-day-picker';
import AcronymTitle from './ui/acronymTitle';
import type { Dispatch, SetStateAction } from 'react';

export interface HeaderComponentProps {
  title: string;
  description: string;
  showCalendarFilter?: boolean;
  selectedDate?: Date | DateRange;
  setSelectedDate?:
    | Dispatch<SetStateAction<DateRange | undefined>>
    | Dispatch<SetStateAction<Date | undefined>>
    | Dispatch<SetStateAction<Date>>;
  disableDates?: (date: Date) => boolean;
  calendarMode?: 'single' | 'range';
}

export default function HeaderComponent({
  title,
  description,
  showCalendarFilter = true,
  selectedDate,
  setSelectedDate,
  disableDates,
  calendarMode,
}: HeaderComponentProps) {
  return (
    <div className="bg-surface/30 z-40 w-full border-b border-white/5 backdrop-blur-sm md:fixed">
      <div className="w-full px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">
              <AcronymTitle text={title} />
            </h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          {showCalendarFilter && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="border-cyan/20 hover:bg-cyan/10 hover:border-cyan/40 w-full backdrop-blur-sm md:w-auto"
                >
                  <CalendarIcon className="text-cyan mr-2 h-4 w-4" />
                  {calendarMode === 'single' &&
                    format(selectedDate as Date, 'PPP')}
                  {calendarMode === 'range' &&
                    typeof selectedDate === 'object' &&
                    'from' in selectedDate &&
                    selectedDate?.from &&
                    `${format(selectedDate.from, 'PPP')}${selectedDate?.to ? ` → ${format(selectedDate.to, 'PPP')}` : ``}`}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="bg-surface/95 w-auto border-white/10 p-0 backdrop-blur-xl"
                align="end"
              >
                {calendarMode === 'single' && (
                  <Calendar
                    mode={calendarMode}
                    selected={selectedDate as Date}
                    onSelect={
                      setSelectedDate as Dispatch<
                        SetStateAction<Date | undefined>
                      >
                    }
                    disabled={disableDates}
                    navLayout="around"
                    captionLayout="dropdown"
                    required
                    initialFocus
                  />
                )}
                {calendarMode === 'range' && (
                  <Calendar
                    mode={calendarMode}
                    selected={selectedDate as DateRange}
                    onSelect={
                      setSelectedDate as Dispatch<
                        SetStateAction<DateRange | undefined>
                      >
                    }
                    disabled={disableDates}
                    navLayout="around"
                    captionLayout="dropdown"
                    required
                    min={1}
                    max={5}
                    footer={
                      <p className="text-muted-foreground mt-3 border-t border-white/5 pt-3 text-center text-sm">
                        {typeof selectedDate === 'object' &&
                        'from' in selectedDate &&
                        selectedDate?.from &&
                        selectedDate?.to
                          ? `${Math.ceil((selectedDate.to.getTime() - selectedDate.from.getTime()) / (1000 * 60 * 60 * 24)) + 1} days selected`
                          : 'Pick a range up to 6 days.'}
                      </p>
                    }
                    initialFocus
                  />
                )}
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
}
