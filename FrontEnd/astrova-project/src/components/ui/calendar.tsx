import * as React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "./utils";

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: React.ComponentProps<typeof DayPicker>) {
    const defaultClassNames = getDefaultClassNames();

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                day: cn(
                    "hover:bg-accent dark:hover:bg-accent/50 rounded-full hover:text-primary-foreground",
                    "w-full size-8 p-0 font-normal aria-selected:opacity-100",
                ),
                selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                chevron: `fill-primary`,
                root: `${defaultClassNames.root} shadow-lg p-5`,
                months_dropdown: 'bg-popover text-popover-foreground m-5',
                years_dropdown: 'bg-popover text-popover-foreground m-5',
                range_start: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-r-none",
                range_end: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground  rounded-l-none",
                range_middle: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground  rounded-none",
                ...classNames,
            }}
            {...props}
        />
    );
}

export { Calendar };
