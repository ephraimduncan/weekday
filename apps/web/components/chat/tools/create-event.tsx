import type { ToolInvocation } from "ai";

import { CalendarDays } from "lucide-react";

import { EventItem } from "@/components/event-calendar/event-item";
import { formatEventTimeDisplay } from "@/lib/utils";

export function CreateEventResult({
  toolInvocation,
}: {
  toolInvocation: ToolInvocation;
}) {
  if (toolInvocation.state !== "result" || !toolInvocation.result) {
    return null;
  }

  const result = toolInvocation.result;

  if (result.error) {
    return (
      <div className="flex flex-col gap-2 px-2 py-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gray-500" />
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Event Creation Failed
          </p>
        </div>
        <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            {result.error}
          </p>
        </div>
      </div>
    );
  }

  const event = result.event;
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  return (
    <div className="flex flex-col gap-2 px-2 py-3">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-gray-500" />
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Event Created Successfully
        </p>
      </div>
      <div className="mt-2 flex flex-col space-y-2">
        <div className="flex h-full gap-2">
          {!event.allDay && (
            <div className="flex w-12 flex-shrink-0 flex-col items-end justify-between py-1 text-xs">
              <p>{formatEventTimeDisplay(startDate.toISOString())}</p>
              <p>{formatEventTimeDisplay(endDate.toISOString())}</p>
            </div>
          )}
          <EventItem
            onClick={() => console.log("Event clicked in chat:", event)}
            event={event}
            view="agenda"
          />
        </div>
      </div>
    </div>
  );
}

export function CreateEventCall() {
  return (
    <div className="flex flex-col gap-2 px-2 py-3">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-gray-500" />
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Creating Calendar Event
        </p>
      </div>
    </div>
  );
}
