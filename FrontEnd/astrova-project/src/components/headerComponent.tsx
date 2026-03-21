import { CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from 'date-fns';
import { Calendar } from "./ui/calendar";
import type { DateRange } from "react-day-picker";
import AcronymTitle from "./ui/acronymTitle";
import type { Dispatch, SetStateAction } from "react";

export interface HeaderComponentProps {
    title: string;
    description: string;
    showCalendarFilter?: boolean;
    selectedDate?: Date | DateRange;
    setSelectedDate?: Dispatch<SetStateAction<DateRange | undefined>>
    | Dispatch<SetStateAction<Date | undefined>>
    | Dispatch<SetStateAction<Date>>;
    disableDates?: (date: Date) => boolean;
    calendarMode?: 'single' | 'range';
}

export default function HeaderComponent({ title, description, showCalendarFilter = true, selectedDate, setSelectedDate, disableDates, calendarMode }: HeaderComponentProps) {
    return (<div className="md:fixed w-full z-50 border-b border-white/5 bg-surface/30 backdrop-blur-sm">
        <div className="w-full py-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        <AcronymTitle text={title} />
                    </h1>
                    <p className="text-muted-foreground">
                        {description}
                    </p>
                </div>
                {showCalendarFilter && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full md:w-auto border-cyan/20 hover:bg-cyan/10 hover:border-cyan/40 backdrop-blur-sm"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-cyan" />
                                {calendarMode === "single" && format(selectedDate as Date, 'PPP')}
                                {calendarMode === "range" && typeof selectedDate === 'object' && 'from' in selectedDate && selectedDate?.from
                                    && `${format(selectedDate.from, 'PPP')}${selectedDate?.to ? ` → ${format(selectedDate.to, 'PPP')}` : ``}`
                                }
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-surface/95 backdrop-blur-xl border-white/10" align="end">
                            {calendarMode === "single" && (
                                <Calendar
                                    mode={calendarMode}
                                    selected={selectedDate as Date}
                                    onSelect={setSelectedDate as Dispatch<SetStateAction<Date | undefined>>}
                                    disabled={disableDates}
                                    navLayout='around'
                                    captionLayout="dropdown"
                                    required
                                    initialFocus
                                />)}
                            {calendarMode === "range" && (
                                <Calendar
                                    mode={calendarMode}
                                    selected={selectedDate as DateRange}
                                    onSelect={setSelectedDate as Dispatch<SetStateAction<DateRange | undefined>>}
                                    disabled={disableDates}
                                    navLayout='around'
                                    captionLayout="dropdown"
                                    required
                                    min={1}
                                    max={5}
                                    footer={<p className="text-center text-sm text-muted-foreground pt-3 border-t border-white/5 mt-3">
                                        {typeof selectedDate === 'object' && 'from' in selectedDate && selectedDate?.from && selectedDate?.to
                                            ? `${Math.ceil((selectedDate.to.getTime() - selectedDate.from.getTime()) / (1000 * 60 * 60 * 24)) + 1} days selected`
                                            : 'Pick a range up to 6 days.'
                                        }
                                    </p>}
                                    initialFocus
                                />)}
                        </PopoverContent>
                    </Popover>
                )}

            </div>
        </div>
    </div>)
}