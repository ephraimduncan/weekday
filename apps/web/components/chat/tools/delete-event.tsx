import type { ToolInvocation } from "ai";

import { CheckCircle, Hourglass, Trash2, XCircle } from "lucide-react";

// Card components are no longer used
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { cn } from "@/lib/utils"; // cn might not be needed

function formatEventTime(start: string, end: string, allDay?: boolean): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
    month: "short",
    year: "numeric",
  };

  if (allDay) {
    return `${startDate.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })} (All Day)`;
  }
  if (startDate.toDateString() === endDate.toDateString()) {
    return `${startDate.toLocaleTimeString(undefined, { hour: "numeric", hour12: true, minute: "2-digit" })} - ${endDate.toLocaleTimeString(undefined, { hour: "numeric", hour12: true, minute: "2-digit" })} on ${startDate.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`;
  } else {
    return `${startDate.toLocaleString(undefined, options)} - ${endDate.toLocaleString(undefined, options)}`;
  }
}

export interface DeleteEventCallProps {
  // Props if needed in the future, for now, it's a static message
}

export function DeleteEventCall(_props: DeleteEventCallProps) {
  return (
    <div className="flex flex-col gap-1 px-3 py-2 text-sm">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <Hourglass className="h-4 w-4 shrink-0 animate-spin text-blue-500" />
        <p className="font-medium">Attempting to delete event...</p>
      </div>
    </div>
  );
}

export interface DeleteEventResultProps {
  toolInvocation: ToolInvocation;
}

interface DeletedEventDetails {
  id: string;
  end: string;
  start: string;
  title: string;
  allDay?: boolean;
}

interface DeleteEventToolResult {
  success: boolean;
  attemptedEventDetails?: {
    title?: string;
  };
  deletedEvent?: DeletedEventDetails;
  error?: string;
  eventId?: string;
  message?: string;
}

export function DeleteEventResult({ toolInvocation }: DeleteEventResultProps) {
  if (toolInvocation.state !== "result" || !toolInvocation.result) {
    return null;
  }

  const result = toolInvocation.result as DeleteEventToolResult;

  const {
    attemptedEventDetails,
    deletedEvent,
    error,
    eventId,
    message,
    success,
  } = result;

  return (
    <div className="flex flex-col gap-2 px-3 py-2 text-sm">
      <div className="flex items-center gap-2">
        {success ? (
          <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
        ) : (
          <XCircle className="h-4 w-4 shrink-0 text-red-500" />
        )}
        <p
          className={`font-medium ${success ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
        >
          {success ? "Event Deletion Successful" : "Event Deletion Failed"}
        </p>
      </div>

      {message && !success && (
        <div className="mt-1 rounded-md border border-gray-200 bg-gray-50 p-2 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800/30 dark:text-gray-300">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-1 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {success && deletedEvent && (
        <div className="mt-1 rounded-md border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {deletedEvent.title}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {formatEventTime(
                  deletedEvent.start,
                  deletedEvent.end,
                  deletedEvent.allDay,
                )}
              </p>
              {/* Optionally display ID if useful */}
              {/* <p className="mt-1 text-xs text-gray-500 dark:text-stone-500">
                ID: {deletedEvent.id}
                </p> */}
            </div>
          </div>
          {message && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {message}
            </p>
          )}
        </div>
      )}

      {!success && eventId && !deletedEvent && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Event ID: {eventId}
          {attemptedEventDetails?.title &&
            ` (Attempted to delete: ${attemptedEventDetails.title})`}
        </p>
      )}
    </div>
  );
}
