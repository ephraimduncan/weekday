"use client";

import { useEffect, useState } from "react";

import { useCalendarContext } from "@/components/event-calendar/calendar-context";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface SidebarCalendarProps {
  className?: string;
}

export default function SidebarCalendar({ className }: SidebarCalendarProps) {
  // Use the shared calendar context
  const { currentDate, setCurrentDate } = useCalendarContext();

  // Track the month to display in the calendar
  const [calendarMonth, setCalendarMonth] = useState<Date>(currentDate);

  // Update the calendar month whenever currentDate changes
  useEffect(() => {
    setCalendarMonth(currentDate);
  }, [currentDate]);

  // Handle date selection
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
    }
  };

  return (
    <div className={cn("w-full flex justify-center", className)}>
      <Calendar
        selected={currentDate}
        onMonthChange={setCalendarMonth}
        onSelect={handleSelect}
        classNames={{
          day_button:
            "transition-none! hover:not-in-data-selected:bg-sidebar-accent group-[.range-middle]:group-data-selected:bg-sidebar-accent text-sidebar-foreground",
          outside: "data-selected:bg-sidebar-accent/50",
          today: "*:after:transition-none",
        }}
        mode="single"
        month={calendarMonth}
      />
    </div>
  );
}
