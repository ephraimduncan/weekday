import type { CalendarEvent } from "@/components/event-calendar";

import { type ClassValue, clsx } from "clsx";
import { format, startOfDay } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const groupEventsByDate = (
  events: CalendarEvent[],
): Map<string, CalendarEvent[]> => {
  const grouped = new Map<string, CalendarEvent[]>();
  events.forEach((event) => {
    const eventDate = startOfDay(new Date(event.start)).toISOString();
    if (!grouped.has(eventDate)) {
      grouped.set(eventDate, []);
    }
    grouped.get(eventDate)!.push(event);
  });
  return grouped;
};

export const formatPreciseUpcomingStatusText = (
  totalMinutes: number,
): string => {
  if (totalMinutes <= 0) {
    return "Starting now";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  }

  if (parts.length === 0) {
    return "Starts in less than a minute";
  }

  return `Starts in ${parts.join(" ")}`;
};

export const formatEventTimeDisplay = (
  dateString: string | null | undefined,
): string => {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);
  const minutes = date.getMinutes();
  if (minutes === 0) {
    return format(date, "ha");
  }
  return format(date, "h:mma");
};

export const formatEventDateTime = (
  dateString: string | null | undefined,
  includeDate: boolean = false,
): string => {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);
  const minutes = date.getMinutes();

  if (includeDate) {
    if (minutes === 0) {
      return format(date, "MMM d, yyyy ha");
    }
    return format(date, "MMM d, yyyy h:mma");
  } else {
    if (minutes === 0) {
      return format(date, "ha");
    }
    return format(date, "h:mma");
  }
};

export const datesAreDifferent = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() !== d2.toDateString();
};
