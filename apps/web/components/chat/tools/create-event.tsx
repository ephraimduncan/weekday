import type { ToolUIPart } from "ai";

import { CalendarDays } from "lucide-react";

import { EventItem } from "@/components/event-calendar/event-item";
import { formatEventTimeDisplay } from "@/lib/utils";

export function CreateEventCall() {
  return (
    <div className="flex flex-col gap-2 py-3">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-gray-500" />
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Creating Event
        </p>
      </div>
      <p className="pl-6 text-sm text-gray-500 dark:text-gray-400">
        Setting up your calendar event...
      </p>
    </div>
  );
}

export function CreateRecurringEventCall() {
  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-gray-500" />
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Creating Recurring Event
        </p>
      </div>
      <p className="pl-6 text-sm text-gray-500 dark:text-gray-400">
        Setting up your recurring calendar event...
      </p>
    </div>
  );
}

export function CreateEventResult({
  toolInvocation,
}: {
  toolInvocation: ToolUIPart;
}) {
  if (toolInvocation.state !== "output-available" || !toolInvocation.output) {
    return null;
  }

  const result = toolInvocation.output as { error?: string; event?: any };

  if (result.error) {
    return (
      <div className="flex flex-col gap-2 py-2">
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
    <div className="flex flex-col gap-3 py-2">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-gray-500" />
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Event Created
        </p>
      </div>
      <div className="flex h-full gap-2">
        {!event.allDay && (event.start || event.end) && (
          <div className="flex w-12 shrink-0 flex-col items-end justify-between py-1 text-xs">
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
          event={{
            id: event.id,
            allDay: event.allDay,
            calendarId: event.calendarId,
            description: event.description,
            end: endDate,
            location: event.location,
            start: startDate,
            title: event.title,
          }}
          view="agenda"
        />
      </div>
    </div>
  );
}

export function CreateRecurringEventResult({
  toolInvocation,
}: {
  toolInvocation: ToolUIPart;
}) {
  if (toolInvocation.state !== "output-available" || !toolInvocation.output) {
    return null;
  }

  const result = toolInvocation.output as { error?: string; event?: any };

  if (result.error) {
    return (
      <div className="flex flex-col gap-2 py-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gray-500" />
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Recurring Event Creation Failed
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
    <div className="flex flex-col gap-3 py-2">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-gray-500" />
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Recurring Event Created
        </p>
      </div>
      <div className="flex h-full gap-2">
        {!event.allDay && (event.start || event.end) && (
          <div className="flex w-12 shrink-0 flex-col items-end justify-between py-1 text-xs">
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
          onClick={() => console.log("Recurring event clicked in chat:", event)}
          event={{
            id: event.id,
            allDay: event.allDay,
            calendarId: event.calendarId,
            description: event.description,
            end: endDate,
            location: event.location,
            recurrence: event.recurrence,
            start: startDate,
            title: event.title,
          }}
          view="agenda"
        />
      </div>
      {event.recurrence && event.recurrence !== "none" && (
        <div className="pl-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Repeats {event.recurrence}
          </p>
        </div>
      )}
    </div>
  );
}
