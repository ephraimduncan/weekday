import type { ToolUIPart, UIMessage } from "ai";

import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

import { EventItem } from "@/components/event-calendar/event-item";
import {
  datesAreDifferent,
  formatEventDateTime,
  formatEventTimeDisplay,
} from "@/lib/utils";

export function UpdateEventResult({
  message,
  toolInvocation,
}: {
  message: UIMessage;
  toolInvocation: ToolUIPart;
}) {
  if (toolInvocation.state !== "output-available" || !toolInvocation.output) {
    return null;
  }

  const result = toolInvocation.output as { error?: string; event?: any };

  if (result.error) {
    return (
      <div className="flex flex-col gap-2 px-2 py-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gray-500" />
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Event Update Failed
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

  let originalDateInfo = "";
  if (message.parts) {
    for (let i = 0; i < message.parts.length; i++) {
      const part = message.parts[i];
      if (part?.type === "text" && part.text.includes("Moved from")) {
        const match = part.text.match(/Moved from (.*?) to (.*?),/);
        if (match && match[1]) {
          originalDateInfo = match[1];
          break;
        }
      }
    }
  }

  const event = result.event;
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  return (
    <div className="flex flex-col gap-2 px-2 py-3">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-gray-500" />
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Event Updated Successfully
        </p>
      </div>

      {originalDateInfo && (
        <div className="mt-2 border-l-2 border-gray-200 pl-3 dark:border-gray-700">
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
            Previous:
          </p>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {originalDateInfo}
          </div>
        </div>
      )}

      <div className="mt-2 border-l-2 border-green-300 pl-3 dark:border-green-700">
        <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
          Updated:{" "}
          {originalDateInfo && (
            <span className="text-green-600 dark:text-green-400">
              {format(startDate, "MMM d, yyyy")}
            </span>
          )}
        </p>
        <div className="flex h-full gap-2">
          {!event.allDay && (
            <div className="flex w-12 shrink-0 flex-col items-end justify-between py-1 text-xs">
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

export function UpdateEventCall({
  toolInvocation,
}: {
  toolInvocation: ToolUIPart;
}) {
  const updateDetails = toolInvocation.input as { 
    newEndTime?: string; 
    newStartTime?: string; 
    originalEndTime?: string; 
    originalStartTime?: string; 
    summary?: string; 
  };
  const originalStartTime = updateDetails.originalStartTime;
  const originalEndTime = updateDetails.originalEndTime;
  const newStartTime = updateDetails.newStartTime;
  const newEndTime = updateDetails.newEndTime;

  return (
    <div className="flex flex-col gap-2 px-2 py-3">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-gray-500" />
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Updating Calendar Event
        </p>
      </div>

      {(originalStartTime || originalEndTime) && (
        <div className="mt-2 border-l-2 border-gray-200 pl-3 dark:border-gray-700">
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
            Before:
          </p>
          <div className="flex items-center gap-2">
            {originalStartTime && originalEndTime && (
              <div className="flex w-24 shrink-0 flex-col items-end text-xs text-gray-500">
                <p>
                  {originalStartTime &&
                    newStartTime &&
                    formatEventDateTime(
                      originalStartTime,
                      datesAreDifferent(originalStartTime, newStartTime),
                    )}
                </p>
                <p>
                  {originalEndTime &&
                    newEndTime &&
                    formatEventDateTime(
                      originalEndTime,
                      datesAreDifferent(originalEndTime, newEndTime),
                    )}
                </p>
              </div>
            )}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {updateDetails.summary || "Event"}
            </div>
          </div>
        </div>
      )}

      {(newStartTime || newEndTime) && (
        <div className="mt-2 border-l-2 border-green-300 pl-3 dark:border-green-700">
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
            After:
          </p>
          <div className="flex items-center gap-2">
            {newStartTime && newEndTime && (
              <div className="flex w-24 shrink-0 flex-col items-end text-xs text-gray-500">
                <p>
                  {originalStartTime &&
                    newStartTime &&
                    formatEventDateTime(
                      newStartTime,
                      datesAreDifferent(originalStartTime, newStartTime),
                    )}
                </p>
                <p>
                  {originalEndTime &&
                    newEndTime &&
                    formatEventDateTime(
                      newEndTime,
                      datesAreDifferent(originalEndTime, newEndTime),
                    )}
                </p>
              </div>
            )}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {updateDetails.summary || "Event"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
