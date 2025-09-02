import type { ToolInvocation } from "ai";

import { format, isToday, startOfDay } from "date-fns";
import { CalendarDays } from "lucide-react";
import { nanoid } from "nanoid";

import { type CalendarEvent, EventItem } from "@/components/event-calendar";
import { formatEventTimeDisplay, groupEventsByDate } from "@/lib/utils";

export function GetEventResult({
  toolInvocation,
}: {
  toolInvocation: ToolInvocation;
}) {
  if (toolInvocation.state !== "result" || !toolInvocation.result) {
    return null;
  }

  const events = toolInvocation.result.events as CalendarEvent[];
  const groupedEvents = groupEventsByDate(events);
  const uniqueDates = Array.from(groupedEvents.keys());

  return (
    <div className="flex flex-col gap-2 px-2 py-3">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-gray-500" />
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Calendar Events
        </p>
      </div>

      {events && events.length > 0 ? (
        uniqueDates.length === 1 ? (
          <div className="mt-2 flex flex-col space-y-2">
            {events.map((event: CalendarEvent) => (
              <div key={event.id} className="flex h-full gap-2">
                {!event.allDay && (event.start || event.end) && (
                  <div className="flex w-12 shrink-0 flex-col items-end justify-between py-1 text-xs">
                    <p>
                      {event.start
                        ? formatEventTimeDisplay(
                            new Date(event.start).toISOString(),
                          )
                        : ""}
                    </p>
                    <p>
                      {event.end
                        ? formatEventTimeDisplay(
                            new Date(event.end).toISOString(),
                          )
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
            ))}
          </div>
        ) : (
          <div className="mt-2 flex flex-col">
            {uniqueDates.map((dateStr) => {
              const dayEvents = groupedEvents.get(dateStr) || [];
              if (dayEvents.length === 0) return null;

              const groupStartDate = new Date(dateStr);

              let maxEndDateForGroup = groupStartDate;
              for (const event of dayEvents) {
                if (event.end) {
                  const eventEndDate = new Date(event.end);
                  if (!isNaN(eventEndDate.getTime())) {
                    if (eventEndDate > maxEndDateForGroup) {
                      maxEndDateForGroup = eventEndDate;
                    }
                  }
                }
              }

              let dateDisplayString: string;
              if (startOfDay(maxEndDateForGroup) > startOfDay(groupStartDate)) {
                dateDisplayString = `${format(
                  groupStartDate,
                  "d MMM",
                )} - ${format(maxEndDateForGroup, "d MMM, EEEE")}`;
              } else {
                dateDisplayString = format(groupStartDate, "d MMM, EEEE");
              }

              return (
                <div
                  key={dateStr}
                  className="border-border/70 relative my-4 border-t pt-1 first:mt-2 first:border-t-0"
                >
                  <span
                    className="bg-background text-muted-foreground absolute -top-2.5 left-0 flex h-5 items-center pe-2 text-[10px] uppercase data-today:font-semibold sm:text-xs"
                    data-today={isToday(groupStartDate) || undefined}
                  >
                    {dateDisplayString}
                  </span>
                  <div className="mt-4 space-y-2">
                    {dayEvents.map((event: CalendarEvent) => (
                      <div key={event.id} className="flex h-full gap-2">
                        {!event.allDay && (event.start || event.end) && (
                          <div className="flex w-12 shrink-0 flex-col items-end justify-between py-1 text-xs">
                            <p>
                              {event.start
                                ? formatEventTimeDisplay(
                                    new Date(event.start).toISOString(),
                                  )
                                : ""}
                            </p>
                            <p>
                              {event.end
                                ? formatEventTimeDisplay(
                                    new Date(event.end).toISOString(),
                                  )
                                : ""}
                            </p>
                          </div>
                        )}
                        <EventItem
                          key={event.id || nanoid()}
                          onClick={() =>
                            console.log("Event clicked in chat:", event)
                          }
                          event={event}
                          view="agenda"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <p className="pl-6 text-sm text-gray-500 dark:text-gray-400">
          No events found.
        </p>
      )}
    </div>
  );
}

export function GetEventCall() {
  return (
    <div className="flex items-center gap-2 p-2">
      <CalendarDays className="h-4 w-4 text-gray-500" />
      <p className="font-medium text-gray-700 dark:text-gray-300">
        Getting events...
      </p>
    </div>
  );
}
