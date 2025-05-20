"use client";

import * as React from "react";
import { type CustomComponents, DayPicker } from "react-day-picker";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const defaultClassNames = {
  button_next: cn(
    buttonVariants({ variant: "ghost" }),
    "size-8 text-muted-foreground/80 hover:text-foreground p-0",
  ),
  button_previous: cn(
    buttonVariants({ variant: "ghost" }),
    "size-8 text-muted-foreground/80 hover:text-foreground p-0",
  ),
  caption_label: "text-sm font-medium",
  day: "group size-8 px-0 py-px text-sm relative before:absolute before:inset-y-px before:inset-x-0 [&.range-start:not(.range-end):before]:bg-linear-to-r before:from-transparent before:from-50% before:to-accent before:to-50% [&.range-end:not(.range-start):before]:bg-linear-to-l",
  day_button:
    "relative flex size-8 items-center justify-center whitespace-nowrap rounded-full p-0 text-foreground group-[[data-selected]:not(.range-middle)]:[transition-property:color,background-color,border-radius,box-shadow] group-[[data-selected]:not(.range-middle)]:duration-150 group-data-disabled:pointer-events-none focus-visible:z-10 hover:not-in-data-selected:bg-accent group-data-selected:bg-primary hover:not-in-data-selected:text-foreground group-data-selected:text-primary-foreground group-data-disabled:text-foreground/30 group-data-disabled:line-through group-data-outside:text-foreground/30 group-data-selected:group-data-outside:text-primary-foreground outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] group-[.range-start:not(.range-end)]:rounded-e-full group-[.range-end:not(.range-start)]:rounded-s-full group-[.range-middle]:rounded-none group-[.range-middle]:group-data-selected:bg-accent group-[.range-middle]:group-data-selected:text-foreground",
  hidden: "invisible",
  month: "w-full",
  month_caption:
    "relative mx-10 mb-1 flex h-9 items-center justify-center z-20",
  months: "relative flex flex-col sm:flex-row gap-4",
  nav: "absolute top-0 flex w-full justify-between z-10",
  outside:
    "text-muted-foreground data-selected:bg-accent/50 data-selected:text-muted-foreground",
  range_end: "range-end",
  range_middle: "range-middle",
  range_start: "range-start",
  today:
    "*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:z-10 *:after:size-[3px] *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-primary [&[data-selected]:not(.range-middle)>*]:after:bg-background [&[data-disabled]>*]:after:bg-foreground/30 *:after:transition-colors",
  week_number: "size-8 p-0 text-xs font-medium text-muted-foreground/80",
  weekday: "size-8 p-0 text-xs font-medium text-muted-foreground/80",
};

// Create a chevron component that conforms to the expected interface
const ChevronIcon = ({
  className,
  orientation,
}: {
  className?: string;
  orientation?: "down" | "left" | "right" | "up";
}) => {
  if (orientation === "left") {
    return (
      <ChevronLeftIcon size={16} className={className} aria-hidden="true" />
    );
  }
  return (
    <ChevronRightIcon size={16} className={className} aria-hidden="true" />
  );
};

// Define default components
const defaultComponents: Partial<CustomComponents> = {
  Chevron: ChevronIcon,
};

function CalendarComponent({
  className,
  classNames,
  components: userComponents,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  // Memoize merged classNames for stability
  const mergedClassNames = React.useMemo(() => {
    return Object.keys(defaultClassNames).reduce(
      (acc, key) => ({
        ...acc,
        [key]: classNames?.[key as keyof typeof classNames]
          ? cn(
              defaultClassNames[key as keyof typeof defaultClassNames],
              classNames[key as keyof typeof classNames],
            )
          : defaultClassNames[key as keyof typeof defaultClassNames],
      }),
      {} as typeof defaultClassNames,
    );
  }, [classNames]);

  // Memoize merged components for stability
  const mergedComponents = React.useMemo(() => {
    return {
      ...defaultComponents,
      ...userComponents,
    };
  }, [userComponents]);

  return (
    <DayPicker
      className={cn("w-fit", className)}
      classNames={mergedClassNames}
      components={mergedComponents}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );
}

// Create a memoized version of the Calendar component with appropriate comparison
const Calendar = React.memo(CalendarComponent, (prevProps, nextProps) => {
  // Compare the most common props that affect rendering
  return (
    prevProps.month?.toString() === nextProps.month?.toString() &&
    prevProps.mode === nextProps.mode &&
    prevProps.fromDate?.toString() === nextProps.fromDate?.toString() &&
    prevProps.toDate?.toString() === nextProps.toDate?.toString() &&
    prevProps.disabled?.toString() === nextProps.disabled?.toString() &&
    prevProps.className === nextProps.className
  );
});

Calendar.displayName = "Calendar";

export { Calendar };
