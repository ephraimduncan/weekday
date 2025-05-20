import type { ToolInvocation } from "ai";

import { CalendarDays } from "lucide-react";

import { type CalendarEvent, EventItem } from "@/components/event-calendar";
import {
  formatEventTimeDisplay,
  formatPreciseUpcomingStatusText,
} from "@/lib/utils";

export function GetUpcomingEventResult({
  toolInvocation,
}: {
  toolInvocation: ToolInvocation;
}) {
  if (toolInvocation.state !== "result" || !toolInvocation.result) {
    return null;
  }

  const result = toolInvocation.result;
  const {
    event,
    minutesToStart,
    status: eventStatus,
  } = toolInvocation.result as {
    event: CalendarEvent;
    minutesToStart: number;
    status: string;
  };

  if (!event) {
    return (
      <div className="flex flex-col gap-2 px-2 py-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gray-500" />
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Next Upcoming Event
          </p>
        </div>
        <p className="pl-6 text-sm text-gray-500 dark:text-gray-400">
          No upcoming event found.
        </p>
      </div>
    );
  }

  let statusText = "";
  if (eventStatus === "upcoming") {
    statusText = formatPreciseUpcomingStatusText(minutesToStart);
  } else if (eventStatus === "ongoing") {
    statusText = "Ongoing";
  }

  return (
    <div className="flex flex-col gap-3 px-2 py-3">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-gray-500" />
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Next Upcoming Event
        </p>
      </div>
      <div className="flex h-full gap-2">
        {!event.allDay && (event.start || event.end) && (
          <div className="flex w-12 flex-shrink-0 flex-col items-end justify-between py-1 text-xs">
            <p>
              {event.start
                ? formatEventTimeDisplay(new Date(event.start).toISOString())
                : ""}
            </p>
            <p>
              {event.end
                ? formatEventTimeDisplay(new Date(event.end).toISOString())
                : ""}
            </p>
          </div>
        )}
        <EventItem
          onClick={() => console.log("Event clicked in chat:", event)}
          event={event}
          view="agenda"
        />
      </div>
      {statusText && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{statusText}</p>
      )}
    </div>
  );
}

export function GetUpcomingEventCall() {
  return (
    <div className="flex items-center gap-2 p-2">
      <CalendarDays className="h-4 w-4 text-gray-500" />
      <p className="font-medium text-gray-700 dark:text-gray-300">
        Getting next upcoming event...
      </p>
    </div>
  );
}
